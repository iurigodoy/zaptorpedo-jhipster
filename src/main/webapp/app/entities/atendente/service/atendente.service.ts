import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAtendente, getAtendenteIdentifier } from '../atendente.model';

export type EntityResponseType = HttpResponse<IAtendente>;
export type EntityArrayResponseType = HttpResponse<IAtendente[]>;

@Injectable({ providedIn: 'root' })
export class AtendenteService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/atendentes');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(atendente: IAtendente): Observable<EntityResponseType> {
    return this.http.post<IAtendente>(this.resourceUrl, atendente, { observe: 'response' });
  }

  update(atendente: IAtendente): Observable<EntityResponseType> {
    return this.http.put<IAtendente>(`${this.resourceUrl}/${getAtendenteIdentifier(atendente) as number}`, atendente, {
      observe: 'response',
    });
  }

  partialUpdate(atendente: IAtendente): Observable<EntityResponseType> {
    return this.http.patch<IAtendente>(`${this.resourceUrl}/${getAtendenteIdentifier(atendente) as number}`, atendente, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAtendente>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAtendente[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAtendenteToCollectionIfMissing(
    atendenteCollection: IAtendente[],
    ...atendentesToCheck: (IAtendente | null | undefined)[]
  ): IAtendente[] {
    const atendentes: IAtendente[] = atendentesToCheck.filter(isPresent);
    if (atendentes.length > 0) {
      const atendenteCollectionIdentifiers = atendenteCollection.map(atendenteItem => getAtendenteIdentifier(atendenteItem)!);
      const atendentesToAdd = atendentes.filter(atendenteItem => {
        const atendenteIdentifier = getAtendenteIdentifier(atendenteItem);
        if (atendenteIdentifier == null || atendenteCollectionIdentifiers.includes(atendenteIdentifier)) {
          return false;
        }
        atendenteCollectionIdentifiers.push(atendenteIdentifier);
        return true;
      });
      return [...atendentesToAdd, ...atendenteCollection];
    }
    return atendenteCollection;
  }
}
