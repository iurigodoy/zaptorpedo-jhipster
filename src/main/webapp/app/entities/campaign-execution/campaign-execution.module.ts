import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CampaignExecutionComponent } from './list/campaign-execution.component';
import { CampaignExecutionDetailComponent } from './detail/campaign-execution-detail.component';
import { CampaignExecutionUpdateComponent } from './update/campaign-execution-update.component';
import { CampaignExecutionDeleteDialogComponent } from './delete/campaign-execution-delete-dialog.component';
import { CampaignExecutionRoutingModule } from './route/campaign-execution-routing.module';

@NgModule({
  imports: [SharedModule, CampaignExecutionRoutingModule],
  declarations: [
    CampaignExecutionComponent,
    CampaignExecutionDetailComponent,
    CampaignExecutionUpdateComponent,
    CampaignExecutionDeleteDialogComponent,
  ],
  entryComponents: [CampaignExecutionDeleteDialogComponent],
})
export class CampaignExecutionModule {}
