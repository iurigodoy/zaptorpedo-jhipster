import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { ICampaignExecution, CampaignExecution } from '../campaign-execution.model';
import { CampaignExecutionService } from '../service/campaign-execution.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { ICampaign } from 'app/entities/campaign/campaign.model';
import { CampaignService } from 'app/entities/campaign/service/campaign.service';

@Component({
  selector: 'jhi-campaign-execution-update',
  templateUrl: './campaign-execution-update.component.html',
})
export class CampaignExecutionUpdateComponent implements OnInit {
  isSaving = false;

  campaignsSharedCollection: ICampaign[] = [];

  editForm = this.fb.group({
    id: [],
    body: [null, [Validators.required]],
    bodyContentType: [],
    sheduleDttm: [],
    executionDttm: [],
    campaign: [],
  });

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected campaignExecutionService: CampaignExecutionService,
    protected campaignService: CampaignService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ campaignExecution }) => {
      if (campaignExecution.id === undefined) {
        const today = dayjs().startOf('day');
        campaignExecution.sheduleDttm = today;
        campaignExecution.executionDttm = today;
      }

      this.updateForm(campaignExecution);

      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('zaptorpedoApp.error', { ...err, key: 'error.file.' + err.key })),
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const campaignExecution = this.createFromForm();
    if (campaignExecution.id !== undefined) {
      this.subscribeToSaveResponse(this.campaignExecutionService.update(campaignExecution));
    } else {
      this.subscribeToSaveResponse(this.campaignExecutionService.create(campaignExecution));
    }
  }

  trackCampaignById(index: number, item: ICampaign): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICampaignExecution>>): void {
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

  protected updateForm(campaignExecution: ICampaignExecution): void {
    this.editForm.patchValue({
      id: campaignExecution.id,
      body: campaignExecution.body,
      bodyContentType: campaignExecution.bodyContentType,
      sheduleDttm: campaignExecution.sheduleDttm ? campaignExecution.sheduleDttm.format(DATE_TIME_FORMAT) : null,
      executionDttm: campaignExecution.executionDttm ? campaignExecution.executionDttm.format(DATE_TIME_FORMAT) : null,
      campaign: campaignExecution.campaign,
    });

    this.campaignsSharedCollection = this.campaignService.addCampaignToCollectionIfMissing(
      this.campaignsSharedCollection,
      campaignExecution.campaign
    );
  }

  protected loadRelationshipsOptions(): void {
    this.campaignService
      .query()
      .pipe(map((res: HttpResponse<ICampaign[]>) => res.body ?? []))
      .pipe(
        map((campaigns: ICampaign[]) =>
          this.campaignService.addCampaignToCollectionIfMissing(campaigns, this.editForm.get('campaign')!.value)
        )
      )
      .subscribe((campaigns: ICampaign[]) => (this.campaignsSharedCollection = campaigns));
  }

  protected createFromForm(): ICampaignExecution {
    return {
      ...new CampaignExecution(),
      id: this.editForm.get(['id'])!.value,
      bodyContentType: this.editForm.get(['bodyContentType'])!.value,
      body: this.editForm.get(['body'])!.value,
      sheduleDttm: this.editForm.get(['sheduleDttm'])!.value
        ? dayjs(this.editForm.get(['sheduleDttm'])!.value, DATE_TIME_FORMAT)
        : undefined,
      executionDttm: this.editForm.get(['executionDttm'])!.value
        ? dayjs(this.editForm.get(['executionDttm'])!.value, DATE_TIME_FORMAT)
        : undefined,
      campaign: this.editForm.get(['campaign'])!.value,
    };
  }
}
