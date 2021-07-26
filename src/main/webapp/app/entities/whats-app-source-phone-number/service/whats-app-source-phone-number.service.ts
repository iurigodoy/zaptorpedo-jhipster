import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IWhatsAppSourcePhoneNumber, getWhatsAppSourcePhoneNumberIdentifier } from '../whats-app-source-phone-number.model';

export type EntityResponseType = HttpResponse<IWhatsAppSourcePhoneNumber>;
export type EntityArrayResponseType = HttpResponse<IWhatsAppSourcePhoneNumber[]>;

@Injectable({ providedIn: 'root' })
export class WhatsAppSourcePhoneNumberService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/whats-app-source-phone-numbers');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(whatsAppSourcePhoneNumber: IWhatsAppSourcePhoneNumber): Observable<EntityResponseType> {
    return this.http.post<IWhatsAppSourcePhoneNumber>(this.resourceUrl, whatsAppSourcePhoneNumber, { observe: 'response' });
  }

  update(whatsAppSourcePhoneNumber: IWhatsAppSourcePhoneNumber): Observable<EntityResponseType> {
    return this.http.put<IWhatsAppSourcePhoneNumber>(
      `${this.resourceUrl}/${getWhatsAppSourcePhoneNumberIdentifier(whatsAppSourcePhoneNumber) as number}`,
      whatsAppSourcePhoneNumber,
      { observe: 'response' }
    );
  }

  partialUpdate(whatsAppSourcePhoneNumber: IWhatsAppSourcePhoneNumber): Observable<EntityResponseType> {
    return this.http.patch<IWhatsAppSourcePhoneNumber>(
      `${this.resourceUrl}/${getWhatsAppSourcePhoneNumberIdentifier(whatsAppSourcePhoneNumber) as number}`,
      whatsAppSourcePhoneNumber,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IWhatsAppSourcePhoneNumber>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IWhatsAppSourcePhoneNumber[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addWhatsAppSourcePhoneNumberToCollectionIfMissing(
    whatsAppSourcePhoneNumberCollection: IWhatsAppSourcePhoneNumber[],
    ...whatsAppSourcePhoneNumbersToCheck: (IWhatsAppSourcePhoneNumber | null | undefined)[]
  ): IWhatsAppSourcePhoneNumber[] {
    const whatsAppSourcePhoneNumbers: IWhatsAppSourcePhoneNumber[] = whatsAppSourcePhoneNumbersToCheck.filter(isPresent);
    if (whatsAppSourcePhoneNumbers.length > 0) {
      const whatsAppSourcePhoneNumberCollectionIdentifiers = whatsAppSourcePhoneNumberCollection.map(
        whatsAppSourcePhoneNumberItem => getWhatsAppSourcePhoneNumberIdentifier(whatsAppSourcePhoneNumberItem)!
      );
      const whatsAppSourcePhoneNumbersToAdd = whatsAppSourcePhoneNumbers.filter(whatsAppSourcePhoneNumberItem => {
        const whatsAppSourcePhoneNumberIdentifier = getWhatsAppSourcePhoneNumberIdentifier(whatsAppSourcePhoneNumberItem);
        if (
          whatsAppSourcePhoneNumberIdentifier == null ||
          whatsAppSourcePhoneNumberCollectionIdentifiers.includes(whatsAppSourcePhoneNumberIdentifier)
        ) {
          return false;
        }
        whatsAppSourcePhoneNumberCollectionIdentifiers.push(whatsAppSourcePhoneNumberIdentifier);
        return true;
      });
      return [...whatsAppSourcePhoneNumbersToAdd, ...whatsAppSourcePhoneNumberCollection];
    }
    return whatsAppSourcePhoneNumberCollection;
  }
}
