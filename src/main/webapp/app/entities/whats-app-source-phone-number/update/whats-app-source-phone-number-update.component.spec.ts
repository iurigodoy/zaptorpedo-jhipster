jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { WhatsAppSourcePhoneNumberService } from '../service/whats-app-source-phone-number.service';
import { IWhatsAppSourcePhoneNumber, WhatsAppSourcePhoneNumber } from '../whats-app-source-phone-number.model';
import { ICompany } from 'app/entities/company/company.model';
import { CompanyService } from 'app/entities/company/service/company.service';

import { WhatsAppSourcePhoneNumberUpdateComponent } from './whats-app-source-phone-number-update.component';

describe('Component Tests', () => {
  describe('WhatsAppSourcePhoneNumber Management Update Component', () => {
    let comp: WhatsAppSourcePhoneNumberUpdateComponent;
    let fixture: ComponentFixture<WhatsAppSourcePhoneNumberUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let whatsAppSourcePhoneNumberService: WhatsAppSourcePhoneNumberService;
    let companyService: CompanyService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [WhatsAppSourcePhoneNumberUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(WhatsAppSourcePhoneNumberUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(WhatsAppSourcePhoneNumberUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      whatsAppSourcePhoneNumberService = TestBed.inject(WhatsAppSourcePhoneNumberService);
      companyService = TestBed.inject(CompanyService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Company query and add missing value', () => {
        const whatsAppSourcePhoneNumber: IWhatsAppSourcePhoneNumber = { id: 456 };
        const company: ICompany = { id: 36638 };
        whatsAppSourcePhoneNumber.company = company;

        const companyCollection: ICompany[] = [{ id: 49900 }];
        jest.spyOn(companyService, 'query').mockReturnValue(of(new HttpResponse({ body: companyCollection })));
        const additionalCompanies = [company];
        const expectedCollection: ICompany[] = [...additionalCompanies, ...companyCollection];
        jest.spyOn(companyService, 'addCompanyToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ whatsAppSourcePhoneNumber });
        comp.ngOnInit();

        expect(companyService.query).toHaveBeenCalled();
        expect(companyService.addCompanyToCollectionIfMissing).toHaveBeenCalledWith(companyCollection, ...additionalCompanies);
        expect(comp.companiesSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const whatsAppSourcePhoneNumber: IWhatsAppSourcePhoneNumber = { id: 456 };
        const company: ICompany = { id: 3255 };
        whatsAppSourcePhoneNumber.company = company;

        activatedRoute.data = of({ whatsAppSourcePhoneNumber });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(whatsAppSourcePhoneNumber));
        expect(comp.companiesSharedCollection).toContain(company);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<WhatsAppSourcePhoneNumber>>();
        const whatsAppSourcePhoneNumber = { id: 123 };
        jest.spyOn(whatsAppSourcePhoneNumberService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ whatsAppSourcePhoneNumber });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: whatsAppSourcePhoneNumber }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(whatsAppSourcePhoneNumberService.update).toHaveBeenCalledWith(whatsAppSourcePhoneNumber);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<WhatsAppSourcePhoneNumber>>();
        const whatsAppSourcePhoneNumber = new WhatsAppSourcePhoneNumber();
        jest.spyOn(whatsAppSourcePhoneNumberService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ whatsAppSourcePhoneNumber });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: whatsAppSourcePhoneNumber }));
        saveSubject.complete();

        // THEN
        expect(whatsAppSourcePhoneNumberService.create).toHaveBeenCalledWith(whatsAppSourcePhoneNumber);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<WhatsAppSourcePhoneNumber>>();
        const whatsAppSourcePhoneNumber = { id: 123 };
        jest.spyOn(whatsAppSourcePhoneNumberService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ whatsAppSourcePhoneNumber });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(whatsAppSourcePhoneNumberService.update).toHaveBeenCalledWith(whatsAppSourcePhoneNumber);
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
