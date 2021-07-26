import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ICampaignExecution } from '../campaign-execution.model';
import { CampaignExecutionService } from '../service/campaign-execution.service';
import { CampaignExecutionDeleteDialogComponent } from '../delete/campaign-execution-delete-dialog.component';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-campaign-execution',
  templateUrl: './campaign-execution.component.html',
})
export class CampaignExecutionComponent implements OnInit {
  campaignExecutions?: ICampaignExecution[];
  isLoading = false;

  constructor(
    protected campaignExecutionService: CampaignExecutionService,
    protected dataUtils: DataUtils,
    protected modalService: NgbModal
  ) {}

  loadAll(): void {
    this.isLoading = true;

    this.campaignExecutionService.query().subscribe(
      (res: HttpResponse<ICampaignExecution[]>) => {
        this.isLoading = false;
        this.campaignExecutions = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ICampaignExecution): number {
    return item.id!;
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }

  delete(campaignExecution: ICampaignExecution): void {
    const modalRef = this.modalService.open(CampaignExecutionDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.campaignExecution = campaignExecution;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
