jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { AtendenteService } from '../service/atendente.service';
import { IAtendente, Atendente } from '../atendente.model';
import { ICompany } from 'app/entities/company/company.model';
import { CompanyService } from 'app/entities/company/service/company.service';

import { AtendenteUpdateComponent } from './atendente-update.component';

describe('Component Tests', () => {
  describe('Atendente Management Update Component', () => {
    let comp: AtendenteUpdateComponent;
    let fixture: ComponentFixture<AtendenteUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let atendenteService: AtendenteService;
    let companyService: CompanyService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [AtendenteUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(AtendenteUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(AtendenteUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      atendenteService = TestBed.inject(AtendenteService);
      companyService = TestBed.inject(CompanyService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Company query and add missing value', () => {
        const atendente: IAtendente = { id: 456 };
        const company: ICompany = { id: 85134 };
        atendente.company = company;

        const companyCollection: ICompany[] = [{ id: 98851 }];
        jest.spyOn(companyService, 'query').mockReturnValue(of(new HttpResponse({ body: companyCollection })));
        const additionalCompanies = [company];
        const expectedCollection: ICompany[] = [...additionalCompanies, ...companyCollection];
        jest.spyOn(companyService, 'addCompanyToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ atendente });
        comp.ngOnInit();

        expect(companyService.query).toHaveBeenCalled();
        expect(companyService.addCompanyToCollectionIfMissing).toHaveBeenCalledWith(companyCollection, ...additionalCompanies);
        expect(comp.companiesSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const atendente: IAtendente = { id: 456 };
        const company: ICompany = { id: 90246 };
        atendente.company = company;

        activatedRoute.data = of({ atendente });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(atendente));
        expect(comp.companiesSharedCollection).toContain(company);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Atendente>>();
        const atendente = { id: 123 };
        jest.spyOn(atendenteService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ atendente });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: atendente }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(atendenteService.update).toHaveBeenCalledWith(atendente);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Atendente>>();
        const atendente = new Atendente();
        jest.spyOn(atendenteService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ atendente });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: atendente }));
        saveSubject.complete();

        // THEN
        expect(atendenteService.create).toHaveBeenCalledWith(atendente);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Atendente>>();
        const atendente = { id: 123 };
        jest.spyOn(atendenteService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ atendente });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(atendenteService.update).toHaveBeenCalledWith(atendente);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackCompanyById', () => {
        it('Should return tracked Company primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackCompanyById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
