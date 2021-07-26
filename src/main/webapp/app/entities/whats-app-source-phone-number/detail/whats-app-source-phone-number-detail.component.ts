import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IWhatsAppSourcePhoneNumber } from '../whats-app-source-phone-number.model';

@Component({
  selector: 'jhi-whats-app-source-phone-number-detail',
  templateUrl: './whats-app-source-phone-number-detail.component.html',
})
export class WhatsAppSourcePhoneNumberDetailComponent implements OnInit {
  whatsAppSourcePhoneNumber: IWhatsAppSourcePhoneNumber | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ whatsAppSourcePhoneNumber }) => {
      this.whatsAppSourcePhoneNumber = whatsAppSourcePhoneNumber;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
