import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IWhatsAppSourcePhoneNumber } from '../whats-app-source-phone-number.model';
import { WhatsAppSourcePhoneNumberService } from '../service/whats-app-source-phone-number.service';

@Component({
  templateUrl: './whats-app-source-phone-number-delete-dialog.component.html',
})
export class WhatsAppSourcePhoneNumberDeleteDialogComponent {
  whatsAppSourcePhoneNumber?: IWhatsAppSourcePhoneNumber;

  constructor(protected whatsAppSourcePhoneNumberService: WhatsAppSourcePhoneNumberService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.whatsAppSourcePhoneNumberService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
