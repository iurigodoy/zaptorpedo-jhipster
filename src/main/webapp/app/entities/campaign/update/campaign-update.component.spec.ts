jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { CampaignService } from '../service/campaign.service';
import { ICampaign, Campaign } from '../campaign.model';
import { IWhatsAppSourcePhoneNumber } from 'app/entities/whats-app-source-phone-number/whats-app-source-phone-number.model';
import { WhatsAppSourcePhoneNumberService } from 'app/entities/whats-app-source-phone-number/service/whats-app-source-phone-number.service';
import { IMenu } from 'app/entities/menu/menu.model';
import { MenuService } from 'app/entities/menu/service/menu.service';

import { CampaignUpdateComponent } from './campaign-update.component';

describe('Component Tests', () => {
  describe('Campaign Management Update Component', () => {
    let comp: CampaignUpdateComponent;
    let fixture: ComponentFixture<CampaignUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let campaignService: CampaignService;
    let whatsAppSourcePhoneNumberService: WhatsAppSourcePhoneNumberService;
    let menuService: MenuService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [CampaignUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(CampaignUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CampaignUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      campaignService = TestBed.inject(CampaignService);
      whatsAppSourcePhoneNumberService = TestBed.inject(WhatsAppSourcePhoneNumberService);
      menuService = TestBed.inject(MenuService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call WhatsAppSourcePhoneNumber query and add missing value', () => {
        const campaign: ICampaign = { id: 456 };
        const whatsAppSourcePhoneNumber: IWhatsAppSourcePhoneNumber = { id: 80753 };
        campaign.whatsAppSourcePhoneNumber = whatsAppSourcePhoneNumber;

        const whatsAppSourcePhoneNumberCollection: IWhatsAppSourcePhoneNumber[] = [{ id: 2325 }];
        jest
          .spyOn(whatsAppSourcePhoneNumberService, 'query')
          .mockReturnValue(of(new HttpResponse({ body: whatsAppSourcePhoneNumberCollection })));
        const additionalWhatsAppSourcePhoneNumbers = [whatsAppSourcePhoneNumber];
        const expectedCollection: IWhatsAppSourcePhoneNumber[] = [
          ...additionalWhatsAppSourcePhoneNumbers,
          ...whatsAppSourcePhoneNumberCollection,
        ];
        jest
          .spyOn(whatsAppSourcePhoneNumberService, 'addWhatsAppSourcePhoneNumberToCollectionIfMissing')
          .mockReturnValue(expectedCollection);

        activatedRoute.data = of({ campaign });
        comp.ngOnInit();

        expect(whatsAppSourcePhoneNumberService.query).toHaveBeenCalled();
        expect(whatsAppSourcePhoneNumberService.addWhatsAppSourcePhoneNumberToCollectionIfMissing).toHaveBeenCalledWith(
          whatsAppSourcePhoneNumberCollection,
          ...additionalWhatsAppSourcePhoneNumbers
        );
        expect(comp.whatsAppSourcePhoneNumbersSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Menu query and add missing value', () => {
        const campaign: ICampaign = { id: 456 };
        const menu: IMenu = { id: 34817 };
        campaign.menu = menu;

        const menuCollection: IMenu[] = [{ id: 11284 }];
        jest.spyOn(menuService, 'query').mockReturnValue(of(new HttpResponse({ body: menuCollection })));
        const additionalMenus = [menu];
        const expectedCollection: IMenu[] = [...additionalMenus, ...menuCollection];
        jest.spyOn(menuService, 'addMenuToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ campaign });
        comp.ngOnInit();

        expect(menuService.query).toHaveBeenCalled();
        expect(menuService.addMenuToCollectionIfMissing).toHaveBeenCalledWith(menuCollection, ...additionalMenus);
        expect(comp.menusSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const campaign: ICampaign = { id: 456 };
        const whatsAppSourcePhoneNumber: IWhatsAppSourcePhoneNumber = { id: 56778 };
        campaign.whatsAppSourcePhoneNumber = whatsAppSourcePhoneNumber;
        const menu: IMenu = { id: 5899 };
        campaign.menu = menu;

        activatedRoute.data = of({ campaign });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(campaign));
        expect(comp.whatsAppSourcePhoneNumbersSharedCollection).toContain(whatsAppSourcePhoneNumber);
        expect(comp.menusSharedCollection).toContain(menu);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Campaign>>();
        const campaign = { id: 123 };
        jest.spyOn(campaignService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ campaign });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: campaign }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(campaignService.update).toHaveBeenCalledWith(campaign);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Campaign>>();
        const campaign = new Campaign();
        jest.spyOn(campaignService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ campaign });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: campaign }));
        saveSubject.complete();

        // THEN
        expect(campaignService.create).toHaveBeenCalledWith(campaign);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Campaign>>();
        const campaign = { id: 123 };
        jest.spyOn(campaignService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ campaign });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(campaignService.update).toHaveBeenCalledWith(campaign);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackWhatsAppSourcePhoneNumberById', () => {
        it('Should return tracked WhatsAppSourcePhoneNumber primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackWhatsAppSourcePhoneNumberById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackMenuById', () => {
        it('Should return tracked Menu primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackMenuById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
