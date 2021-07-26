import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { WhatsAppSourcePhoneNumberComponent } from './list/whats-app-source-phone-number.component';
import { WhatsAppSourcePhoneNumberDetailComponent } from './detail/whats-app-source-phone-number-detail.component';
import { WhatsAppSourcePhoneNumberUpdateComponent } from './update/whats-app-source-phone-number-update.component';
import { WhatsAppSourcePhoneNumberDeleteDialogComponent } from './delete/whats-app-source-phone-number-delete-dialog.component';
import { WhatsAppSourcePhoneNumberRoutingModule } from './route/whats-app-source-phone-number-routing.module';

@NgModule({
  imports: [SharedModule, WhatsAppSourcePhoneNumberRoutingModule],
  declarations: [
    WhatsAppSourcePhoneNumberComponent,
    WhatsAppSourcePhoneNumberDetailComponent,
    WhatsAppSourcePhoneNumberUpdateComponent,
    WhatsAppSourcePhoneNumberDeleteDialogComponent,
  ],
  entryComponents: [WhatsAppSourcePhoneNumberDeleteDialogComponent],
})
export class WhatsAppSourcePhoneNumberModule {}
