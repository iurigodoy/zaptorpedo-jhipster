import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IWhatsAppSourcePhoneNumber } from '../whats-app-source-phone-number.model';
import { WhatsAppSourcePhoneNumberService } from '../service/whats-app-source-phone-number.service';
import { WhatsAppSourcePhoneNumberDeleteDialogComponent } from '../delete/whats-app-source-phone-number-delete-dialog.component';

@Component({
  selector: 'jhi-whats-app-source-phone-number',
  templateUrl: './whats-app-source-phone-number.component.html',
})
export class WhatsAppSourcePhoneNumberComponent implements OnInit {
  whatsAppSourcePhoneNumbers?: IWhatsAppSourcePhoneNumber[];
  isLoading = false;

  constructor(protected whatsAppSourcePhoneNumberService: WhatsAppSourcePhoneNumberService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.whatsAppSourcePhoneNumberService.query().subscribe(
      (res: HttpResponse<IWhatsAppSourcePhoneNumber[]>) => {
        this.isLoading = false;
        this.whatsAppSourcePhoneNumbers = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IWhatsAppSourcePhoneNumber): number {
    return item.id!;
  }

  delete(whatsAppSourcePhoneNumber: IWhatsAppSourcePhoneNumber): void {
    const modalRef = this.modalService.open(WhatsAppSourcePhoneNumberDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.whatsAppSourcePhoneNumber = whatsAppSourcePhoneNumber;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
