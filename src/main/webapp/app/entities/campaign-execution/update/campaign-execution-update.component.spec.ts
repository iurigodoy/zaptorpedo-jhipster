jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { CampaignExecutionService } from '../service/campaign-execution.service';
import { ICampaignExecution, CampaignExecution } from '../campaign-execution.model';
import { ICampaign } from 'app/entities/campaign/campaign.model';
import { CampaignService } from 'app/entities/campaign/service/campaign.service';

import { CampaignExecutionUpdateComponent } from './campaign-execution-update.component';

describe('Component Tests', () => {
  describe('CampaignExecution Management Update Component', () => {
    let comp: CampaignExecutionUpdateComponent;
    let fixture: ComponentFixture<CampaignExecutionUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let campaignExecutionService: CampaignExecutionService;
    let campaignService: CampaignService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [CampaignExecutionUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(CampaignExecutionUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CampaignExecutionUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      campaignExecutionService = TestBed.inject(CampaignExecutionService);
      campaignService = TestBed.inject(CampaignService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Campaign query and add missing value', () => {
        const campaignExecution: ICampaignExecution = { id: 456 };
        const campaign: ICampaign = { id: 793 };
        campaignExecution.campaign = campaign;

        const campaignCollection: ICampaign[] = [{ id: 48773 }];
        jest.spyOn(campaignService, 'query').mockReturnValue(of(new HttpResponse({ body: campaignCollection })));
        const additionalCampaigns = [campaign];
        const expectedCollection: ICampaign[] = [...additionalCampaigns, ...campaignCollection];
        jest.spyOn(campaignService, 'addCampaignToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ campaignExecution });
        comp.ngOnInit();

        expect(campaignService.query).toHaveBeenCalled();
        expect(campaignService.addCampaignToCollectionIfMissing).toHaveBeenCalledWith(campaignCollection, ...additionalCampaigns);
        expect(comp.campaignsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const campaignExecution: ICampaignExecution = { id: 456 };
        const campaign: ICampaign = { id: 84897 };
        campaignExecution.campaign = campaign;

        activatedRoute.data = of({ campaignExecution });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(campaignExecution));
        expect(comp.campaignsSharedCollection).toContain(campaign);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<CampaignExecution>>();
        const campaignExecution = { id: 123 };
        jest.spyOn(campaignExecutionService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ campaignExecution });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: campaignExecution }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(campaignExecutionService.update).toHaveBeenCalledWith(campaignExecution);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<CampaignExecution>>();
        const campaignExecution = new CampaignExecution();
        jest.spyOn(campaignExecutionService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ campaignExecution });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: campaignExecution }));
        saveSubject.complete();

        // THEN
        expect(campaignExecutionService.create).toHaveBeenCalledWith(campaignExecution);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<CampaignExecution>>();
        const campaignExecution = { id: 123 };
        jest.spyOn(campaignExecutionService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ campaignExecution });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(campaignExecutionService.update).toHaveBeenCalledWith(campaignExecution);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackCampaignById', () => {
        it('Should return tracked Campaign primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackCampaignById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
