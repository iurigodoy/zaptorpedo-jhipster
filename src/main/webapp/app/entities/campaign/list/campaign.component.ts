import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ICampaign } from '../campaign.model';
import { CampaignService } from '../service/campaign.service';
import { CampaignDeleteDialogComponent } from '../delete/campaign-delete-dialog.component';

@Component({
  selector: 'jhi-campaign',
  templateUrl: './campaign.component.html',
})
export class CampaignComponent implements OnInit {
  campaigns?: ICampaign[];
  isLoading = false;

  constructor(protected campaignService: CampaignService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.campaignService.query().subscribe(
      (res: HttpResponse<ICampaign[]>) => {
        this.isLoading = false;
        this.campaigns = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ICampaign): number {
    return item.id!;
  }

  delete(campaign: ICampaign): void {
    const modalRef = this.modalService.open(CampaignDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.campaign = campaign;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
