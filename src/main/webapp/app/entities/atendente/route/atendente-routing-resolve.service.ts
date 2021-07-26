import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAtendente, Atendente } from '../atendente.model';
import { AtendenteService } from '../service/atendente.service';

@Injectable({ providedIn: 'root' })
export class AtendenteRoutingResolveService implements Resolve<IAtendente> {
  constructor(protected service: AtendenteService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAtendente> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((atendente: HttpResponse<Atendente>) => {
          if (atendente.body) {
            return of(atendente.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Atendente());
  }
}
