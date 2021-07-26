import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { AtendenteComponent } from '../list/atendente.component';
import { AtendenteDetailComponent } from '../detail/atendente-detail.component';
import { AtendenteUpdateComponent } from '../update/atendente-update.component';
import { AtendenteRoutingResolveService } from './atendente-routing-resolve.service';

const atendenteRoute: Routes = [
  {
    path: '',
    component: AtendenteComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AtendenteDetailComponent,
    resolve: {
      atendente: AtendenteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AtendenteUpdateComponent,
    resolve: {
      atendente: AtendenteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AtendenteUpdateComponent,
    resolve: {
      atendente: AtendenteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(atendenteRoute)],
  exports: [RouterModule],
})
export class AtendenteRoutingModule {}
