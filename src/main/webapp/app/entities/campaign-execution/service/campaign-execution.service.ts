import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICampaignExecution, getCampaignExecutionIdentifier } from '../campaign-execution.model';

export type EntityResponseType = HttpResponse<ICampaignExecution>;
export type EntityArrayResponseType = HttpResponse<ICampaignExecution[]>;

@Injectable({ providedIn: 'root' })
export class CampaignExecutionService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/campaign-executions');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(campaignExecution: ICampaignExecution): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(campaignExecution);
    return this.http
      .post<ICampaignExecution>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(campaignExecution: ICampaignExecution): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(campaignExecution);
    return this.http
      .put<ICampaignExecution>(`${this.resourceUrl}/${getCampaignExecutionIdentifier(campaignExecution) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(campaignExecution: ICampaignExecution): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(campaignExecution);
    return this.http
      .patch<ICampaignExecution>(`${this.resourceUrl}/${getCampaignExecutionIdentifier(campaignExecution) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ICampaignExecution>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ICampaignExecution[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addCampaignExecutionToCollectionIfMissing(
    campaignExecutionCollection: ICampaignExecution[],
    ...campaignExecutionsToCheck: (ICampaignExecution | null | undefined)[]
  ): ICampaignExecution[] {
    const campaignExecutions: ICampaignExecution[] = campaignExecutionsToCheck.filter(isPresent);
    if (campaignExecutions.length > 0) {
      const campaignExecutionCollectionIdentifiers = campaignExecutionCollection.map(
        campaignExecutionItem => getCampaignExecutionIdentifier(campaignExecutionItem)!
      );
      const campaignExecutionsToAdd = campaignExecutions.filter(campaignExecutionItem => {
        const campaignExecutionIdentifier = getCampaignExecutionIdentifier(campaignExecutionItem);
        if (campaignExecutionIdentifier == null || campaignExecutionCollectionIdentifiers.includes(campaignExecutionIdentifier)) {
          return false;
        }
        campaignExecutionCollectionIdentifiers.push(campaignExecutionIdentifier);
        return true;
      });
      return [...campaignExecutionsToAdd, ...campaignExecutionCollection];
    }
    return campaignExecutionCollection;
  }

  protected convertDateFromClient(campaignExecution: ICampaignExecution): ICampaignExecution {
    return Object.assign({}, campaignExecution, {
      sheduleDttm: campaignExecution.sheduleDttm?.isValid() ? campaignExecution.sheduleDttm.toJSON() : undefined,
      executionDttm: campaignExecution.executionDttm?.isValid() ? campaignExecution.executionDttm.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.sheduleDttm = res.body.sheduleDttm ? dayjs(res.body.sheduleDttm) : undefined;
      res.body.executionDttm = res.body.executionDttm ? dayjs(res.body.executionDttm) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((campaignExecution: ICampaignExecution) => {
        campaignExecution.sheduleDttm = campaignExecution.sheduleDttm ? dayjs(campaignExecution.sheduleDttm) : undefined;
        campaignExecution.executionDttm = campaignExecution.executionDttm ? dayjs(campaignExecution.executionDttm) : undefined;
      });
    }
    return res;
  }
}
