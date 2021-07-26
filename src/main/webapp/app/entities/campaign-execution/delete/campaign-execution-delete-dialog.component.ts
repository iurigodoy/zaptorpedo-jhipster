import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICampaignExecution } from '../campaign-execution.model';
import { CampaignExecutionService } from '../service/campaign-execution.service';

@Component({
  templateUrl: './campaign-execution-delete-dialog.component.html',
})
export class CampaignExecutionDeleteDialogComponent {
  campaignExecution?: ICampaignExecution;

  constructor(protected campaignExecutionService: CampaignExecutionService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.campaignExecutionService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
