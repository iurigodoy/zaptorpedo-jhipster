import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICampaignExecution, CampaignExecution } from '../campaign-execution.model';
import { CampaignExecutionService } from '../service/campaign-execution.service';

@Injectable({ providedIn: 'root' })
export class CampaignExecutionRoutingResolveService implements Resolve<ICampaignExecution> {
  constructor(protected service: CampaignExecutionService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICampaignExecution> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((campaignExecution: HttpResponse<CampaignExecution>) => {
          if (campaignExecution.body) {
            return of(campaignExecution.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new CampaignExecution());
  }
}
