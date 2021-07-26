jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { MessageService } from '../service/message.service';
import { IMessage, Message } from '../message.model';
import { IAtendente } from 'app/entities/atendente/atendente.model';
import { AtendenteService } from 'app/entities/atendente/service/atendente.service';
import { IWhatsAppSourcePhoneNumber } from 'app/entities/whats-app-source-phone-number/whats-app-source-phone-number.model';
import { WhatsAppSourcePhoneNumberService } from 'app/entities/whats-app-source-phone-number/service/whats-app-source-phone-number.service';

import { MessageUpdateComponent } from './message-update.component';

describe('Component Tests', () => {
  describe('Message Management Update Component', () => {
    let comp: MessageUpdateComponent;
    let fixture: ComponentFixture<MessageUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let messageService: MessageService;
    let atendenteService: AtendenteService;
    let whatsAppSourcePhoneNumberService: WhatsAppSourcePhoneNumberService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [MessageUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(MessageUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(MessageUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      messageService = TestBed.inject(MessageService);
      atendenteService = TestBed.inject(AtendenteService);
      whatsAppSourcePhoneNumberService = TestBed.inject(WhatsAppSourcePhoneNumberService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Atendente query and add missing value', () => {
        const message: IMessage = { id: 456 };
        const atendente: IAtendente = { id: 27141 };
        message.atendente = atendente;

        const atendenteCollection: IAtendente[] = [{ id: 68824 }];
        jest.spyOn(atendenteService, 'query').mockReturnValue(of(new HttpResponse({ body: atendenteCollection })));
        const additionalAtendentes = [atendente];
        const expectedCollection: IAtendente[] = [...additionalAtendentes, ...atendenteCollection];
        jest.spyOn(atendenteService, 'addAtendenteToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ message });
        comp.ngOnInit();

        expect(atendenteService.query).toHaveBeenCalled();
        expect(atendenteService.addAtendenteToCollectionIfMissing).toHaveBeenCalledWith(atendenteCollection, ...additionalAtendentes);
        expect(comp.atendentesSharedCollection).toEqual(expectedCollection);
      });

      it('Should call WhatsAppSourcePhoneNumber query and add missing value', () => {
        const message: IMessage = { id: 456 };
        const whatsAppSourcePhoneNumber: IWhatsAppSourcePhoneNumber = { id: 51801 };
        message.whatsAppSourcePhoneNumber = whatsAppSourcePhoneNumber;

        const whatsAppSourcePhoneNumberCollection: IWhatsAppSourcePhoneNumber[] = [{ id: 48423 }];
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

        activatedRoute.data = of({ message });
        comp.ngOnInit();

        expect(whatsAppSourcePhoneNumberService.query).toHaveBeenCalled();
        expect(whatsAppSourcePhoneNumberService.addWhatsAppSourcePhoneNumberToCollectionIfMissing).toHaveBeenCalledWith(
          whatsAppSourcePhoneNumberCollection,
          ...additionalWhatsAppSourcePhoneNumbers
        );
        expect(comp.whatsAppSourcePhoneNumbersSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const message: IMessage = { id: 456 };
        const atendente: IAtendente = { id: 26840 };
        message.atendente = atendente;
        const whatsAppSourcePhoneNumber: IWhatsAppSourcePhoneNumber = { id: 81794 };
        message.whatsAppSourcePhoneNumber = whatsAppSourcePhoneNumber;

        activatedRoute.data = of({ message });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(message));
        expect(comp.atendentesSharedCollection).toContain(atendente);
        expect(comp.whatsAppSourcePhoneNumbersSharedCollection).toContain(whatsAppSourcePhoneNumber);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Message>>();
        const message = { id: 123 };
        jest.spyOn(messageService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ message });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: message }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(messageService.update).toHaveBeenCalledWith(message);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Message>>();
        const message = new Message();
        jest.spyOn(messageService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ message });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: message }));
        saveSubject.complete();

        // THEN
        expect(messageService.create).toHaveBeenCalledWith(message);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Message>>();
        const message = { id: 123 };
        jest.spyOn(messageService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ message });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(messageService.update).toHaveBeenCalledWith(message);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackAtendenteById', () => {
        it('Should return tracked Atendente primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackAtendenteById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackWhatsAppSourcePhoneNumberById', () => {
        it('Should return tracked WhatsAppSourcePhoneNumber primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackWhatsAppSourcePhoneNumberById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
