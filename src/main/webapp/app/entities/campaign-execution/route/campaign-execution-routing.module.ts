import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CampaignExecutionComponent } from '../list/campaign-execution.component';
import { CampaignExecutionDetailComponent } from '../detail/campaign-execution-detail.component';
import { CampaignExecutionUpdateComponent } from '../update/campaign-execution-update.component';
import { CampaignExecutionRoutingResolveService } from './campaign-execution-routing-resolve.service';

const campaignExecutionRoute: Routes = [
  {
    path: '',
    component: CampaignExecutionComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CampaignExecutionDetailComponent,
    resolve: {
      campaignExecution: CampaignExecutionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CampaignExecutionUpdateComponent,
    resolve: {
      campaignExecution: CampaignExecutionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CampaignExecutionUpdateComponent,
    resolve: {
      campaignExecution: CampaignExecutionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(campaignExecutionRoute)],
  exports: [RouterModule],
})
export class CampaignExecutionRoutingModule {}
