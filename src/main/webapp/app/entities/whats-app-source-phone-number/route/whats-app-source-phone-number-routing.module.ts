import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { WhatsAppSourcePhoneNumberComponent } from '../list/whats-app-source-phone-number.component';
import { WhatsAppSourcePhoneNumberDetailComponent } from '../detail/whats-app-source-phone-number-detail.component';
import { WhatsAppSourcePhoneNumberUpdateComponent } from '../update/whats-app-source-phone-number-update.component';
import { WhatsAppSourcePhoneNumberRoutingResolveService } from './whats-app-source-phone-number-routing-resolve.service';

const whatsAppSourcePhoneNumberRoute: Routes = [
  {
    path: '',
    component: WhatsAppSourcePhoneNumberComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: WhatsAppSourcePhoneNumberDetailComponent,
    resolve: {
      whatsAppSourcePhoneNumber: WhatsAppSourcePhoneNumberRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: WhatsAppSourcePhoneNumberUpdateComponent,
    resolve: {
      whatsAppSourcePhoneNumber: WhatsAppSourcePhoneNumberRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: WhatsAppSourcePhoneNumberUpdateComponent,
    resolve: {
      whatsAppSourcePhoneNumber: WhatsAppSourcePhoneNumberRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(whatsAppSourcePhoneNumberRoute)],
  exports: [RouterModule],
})
export class WhatsAppSourcePhoneNumberRoutingModule {}
