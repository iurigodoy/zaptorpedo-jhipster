import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICampaignExecution } from '../campaign-execution.model';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-campaign-execution-detail',
  templateUrl: './campaign-execution-detail.component.html',
})
export class CampaignExecutionDetailComponent implements OnInit {
  campaignExecution: ICampaignExecution | null = null;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ campaignExecution }) => {
      this.campaignExecution = campaignExecution;
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  previousState(): void {
    window.history.back();
  }
}
