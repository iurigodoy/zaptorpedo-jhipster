import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IWhatsAppSourcePhoneNumber, WhatsAppSourcePhoneNumber } from '../whats-app-source-phone-number.model';
import { WhatsAppSourcePhoneNumberService } from '../service/whats-app-source-phone-number.service';

@Injectable({ providedIn: 'root' })
export class WhatsAppSourcePhoneNumberRoutingResolveService implements Resolve<IWhatsAppSourcePhoneNumber> {
  constructor(protected service: WhatsAppSourcePhoneNumberService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IWhatsAppSourcePhoneNumber> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((whatsAppSourcePhoneNumber: HttpResponse<WhatsAppSourcePhoneNumber>) => {
          if (whatsAppSourcePhoneNumber.body) {
            return of(whatsAppSourcePhoneNumber.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new WhatsAppSourcePhoneNumber());
  }
}
