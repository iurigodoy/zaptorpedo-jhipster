import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IWhatsAppSourcePhoneNumber, WhatsAppSourcePhoneNumber } from '../whats-app-source-phone-number.model';
import { WhatsAppSourcePhoneNumberService } from '../service/whats-app-source-phone-number.service';
import { ICompany } from 'app/entities/company/company.model';
import { CompanyService } from 'app/entities/company/service/company.service';

@Component({
  selector: 'jhi-whats-app-source-phone-number-update',
  templateUrl: './whats-app-source-phone-number-update.component.html',
})
export class WhatsAppSourcePhoneNumberUpdateComponent implements OnInit {
  isSaving = false;

  companiesSharedCollection: ICompany[] = [];

  editForm = this.fb.group({
    id: [],
    instanceId: [null, [Validators.required]],
    msisdn: [null, [Validators.required]],
    company: [],
  });

  constructor(
    protected whatsAppSourcePhoneNumberService: WhatsAppSourcePhoneNumberService,
    protected companyService: CompanyService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ whatsAppSourcePhoneNumber }) => {
      this.updateForm(whatsAppSourcePhoneNumber);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const whatsAppSourcePhoneNumber = this.createFromForm();
    if (whatsAppSourcePhoneNumber.id !== undefined) {
      this.subscribeToSaveResponse(this.whatsAppSourcePhoneNumberService.update(whatsAppSourcePhoneNumber));
    } else {
      this.subscribeToSaveResponse(this.whatsAppSourcePhoneNumberService.create(whatsAppSourcePhoneNumber));
    }
  }

  trackCompanyById(index: number, item: ICompany): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IWhatsAppSourcePhoneNumber>>): void {
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

  protected updateForm(whatsAppSourcePhoneNumber: IWhatsAppSourcePhoneNumber): void {
    this.editForm.patchValue({
      id: whatsAppSourcePhoneNumber.id,
      instanceId: whatsAppSourcePhoneNumber.instanceId,
      msisdn: whatsAppSourcePhoneNumber.msisdn,
      company: whatsAppSourcePhoneNumber.company,
    });

    this.companiesSharedCollection = this.companyService.addCompanyToCollectionIfMissing(
      this.companiesSharedCollection,
      whatsAppSourcePhoneNumber.company
    );
  }

  protected loadRelationshipsOptions(): void {
    this.companyService
      .query()
      .pipe(map((res: HttpResponse<ICompany[]>) => res.body ?? []))
      .pipe(
        map((companies: ICompany[]) => this.companyService.addCompanyToCollectionIfMissing(companies, this.editForm.get('company')!.value))
      )
      .subscribe((companies: ICompany[]) => (this.companiesSharedCollection = companies));
  }

  protected createFromForm(): IWhatsAppSourcePhoneNumber {
    return {
      ...new WhatsAppSourcePhoneNumber(),
      id: this.editForm.get(['id'])!.value,
      instanceId: this.editForm.get(['instanceId'])!.value,
      msisdn: this.editForm.get(['msisdn'])!.value,
      company: this.editForm.get(['company'])!.value,
    };
  }
}
