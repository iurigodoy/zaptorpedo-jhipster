import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ICampaign, Campaign } from '../campaign.model';
import { CampaignService } from '../service/campaign.service';
import { IWhatsAppSourcePhoneNumber } from 'app/entities/whats-app-source-phone-number/whats-app-source-phone-number.model';
import { WhatsAppSourcePhoneNumberService } from 'app/entities/whats-app-source-phone-number/service/whats-app-source-phone-number.service';
import { IMenu } from 'app/entities/menu/menu.model';
import { MenuService } from 'app/entities/menu/service/menu.service';

@Component({
  selector: 'jhi-campaign-update',
  templateUrl: './campaign-update.component.html',
})
export class CampaignUpdateComponent implements OnInit {
  isSaving = false;

  whatsAppSourcePhoneNumbersSharedCollection: IWhatsAppSourcePhoneNumber[] = [];
  menusSharedCollection: IMenu[] = [];

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    template: [null, [Validators.required]],
    whatsAppSourcePhoneNumber: [],
    menu: [],
  });

  constructor(
    protected campaignService: CampaignService,
    protected whatsAppSourcePhoneNumberService: WhatsAppSourcePhoneNumberService,
    protected menuService: MenuService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ campaign }) => {
      this.updateForm(campaign);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const campaign = this.createFromForm();
    if (campaign.id !== undefined) {
      this.subscribeToSaveResponse(this.campaignService.update(campaign));
    } else {
      this.subscribeToSaveResponse(this.campaignService.create(campaign));
    }
  }

  trackWhatsAppSourcePhoneNumberById(index: number, item: IWhatsAppSourcePhoneNumber): number {
    return item.id!;
  }

  trackMenuById(index: number, item: IMenu): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICampaign>>): void {
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

  protected updateForm(campaign: ICampaign): void {
    this.editForm.patchValue({
      id: campaign.id,
      name: campaign.name,
      template: campaign.template,
      whatsAppSourcePhoneNumber: campaign.whatsAppSourcePhoneNumber,
      menu: campaign.menu,
    });

    this.whatsAppSourcePhoneNumbersSharedCollection =
      this.whatsAppSourcePhoneNumberService.addWhatsAppSourcePhoneNumberToCollectionIfMissing(
        this.whatsAppSourcePhoneNumbersSharedCollection,
        campaign.whatsAppSourcePhoneNumber
      );
    this.menusSharedCollection = this.menuService.addMenuToCollectionIfMissing(this.menusSharedCollection, campaign.menu);
  }

  protected loadRelationshipsOptions(): void {
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

    this.menuService
      .query()
      .pipe(map((res: HttpResponse<IMenu[]>) => res.body ?? []))
      .pipe(map((menus: IMenu[]) => this.menuService.addMenuToCollectionIfMissing(menus, this.editForm.get('menu')!.value)))
      .subscribe((menus: IMenu[]) => (this.menusSharedCollection = menus));
  }

  protected createFromForm(): ICampaign {
    return {
      ...new Campaign(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      template: this.editForm.get(['template'])!.value,
      whatsAppSourcePhoneNumber: this.editForm.get(['whatsAppSourcePhoneNumber'])!.value,
      menu: this.editForm.get(['menu'])!.value,
    };
  }
}
