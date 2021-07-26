import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IMessage, Message } from '../message.model';
import { MessageService } from '../service/message.service';
import { IAtendente } from 'app/entities/atendente/atendente.model';
import { AtendenteService } from 'app/entities/atendente/service/atendente.service';
import { IWhatsAppSourcePhoneNumber } from 'app/entities/whats-app-source-phone-number/whats-app-source-phone-number.model';
import { WhatsAppSourcePhoneNumberService } from 'app/entities/whats-app-source-phone-number/service/whats-app-source-phone-number.service';

@Component({
  selector: 'jhi-message-update',
  templateUrl: './message-update.component.html',
})
export class MessageUpdateComponent implements OnInit {
  isSaving = false;

  atendentesSharedCollection: IAtendente[] = [];
  whatsAppSourcePhoneNumbersSharedCollection: IWhatsAppSourcePhoneNumber[] = [];

  editForm = this.fb.group({
    id: [],
    body: [null, [Validators.required]],
    destinyPhoneNumber: [null, [Validators.required]],
    atendente: [],
    whatsAppSourcePhoneNumber: [],
  });

  constructor(
    protected messageService: MessageService,
    protected atendenteService: AtendenteService,
    protected whatsAppSourcePhoneNumberService: WhatsAppSourcePhoneNumberService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ message }) => {
      this.updateForm(message);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const message = this.createFromForm();
    if (message.id !== undefined) {
      this.subscribeToSaveResponse(this.messageService.update(message));
    } else {
      this.subscribeToSaveResponse(this.messageService.create(message));
    }
  }

  trackAtendenteById(index: number, item: IAtendente): number {
    return item.id!;
  }

  trackWhatsAppSourcePhoneNumberById(index: number, item: IWhatsAppSourcePhoneNumber): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMessage>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(message: IMessage): void {
    this.editForm.patchValue({
      id: message.id,
      body: message.body,
      destinyPhoneNumber: message.destinyPhoneNumber,
      atendente: message.atendente,
      whatsAppSourcePhoneNumber: message.whatsAppSourcePhoneNumber,
    });

    this.atendentesSharedCollection = this.atendenteService.addAtendenteToCollectionIfMissing(
      this.atendentesSharedCollection,
      message.atendente
    );
    this.whatsAppSourcePhoneNumbersSharedCollection =
      this.whatsAppSourcePhoneNumberService.addWhatsAppSourcePhoneNumberToCollectionIfMissing(
        this.whatsAppSourcePhoneNumbersSharedCollection,
        message.whatsAppSourcePhoneNumber
      );
  }

  protected loadRelationshipsOptions(): void {
    this.atendenteService
      .query()
      .pipe(map((res: HttpResponse<IAtendente[]>) => res.body ?? []))
      .pipe(
        map((atendentes: IAtendente[]) =>
          this.atendenteService.addAtendenteToCollectionIfMissing(atendentes, this.editForm.get('atendente')!.value)
        )
      )
      .subscribe((atendentes: IAtendente[]) => (this.atendentesSharedCollection = atendentes));

    this.whatsAppSourcePhoneNumberService
      .query()
      .pipe(map((res: HttpResponse<IWhatsAppSourcePhoneNumber[]>) => res.body ?? []))
      .pipe(
        map((whatsAppSourcePhoneNumbers: IWhatsAppSourcePhoneNumber[]) =>
          this.whatsAppSourcePhoneNumberService.addWhatsAppSourcePhoneNumberToCollectionIfMissing(
            whatsAppSourcePhoneNumbers,
            this.editForm.get('whatsAppSourcePhoneNumber')!.value
          )
        )
      )
      .subscribe(
        (whatsAppSourcePhoneNumbers: IWhatsAppSourcePhoneNumber[]) =>
          (this.whatsAppSourcePhoneNumbersSharedCollection = whatsAppSourcePhoneNumbers)
      );
  }

  protected createFromForm(): IMessage {
    return {
      ...new Message(),
      id: this.editForm.get(['id'])!.value,
      body: this.editForm.get(['body'])!.value,
      destinyPhoneNumber: this.editForm.get(['destinyPhoneNumber'])!.value,
      atendente: this.editForm.get(['atendente'])!.value,
      whatsAppSourcePhoneNumber: this.editForm.get(['whatsAppSourcePhoneNumber'])!.value,
    };
  }
}
