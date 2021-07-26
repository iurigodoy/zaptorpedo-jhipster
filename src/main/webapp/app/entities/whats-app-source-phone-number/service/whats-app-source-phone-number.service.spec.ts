import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IWhatsAppSourcePhoneNumber, WhatsAppSourcePhoneNumber } from '../whats-app-source-phone-number.model';

import { WhatsAppSourcePhoneNumberService } from './whats-app-source-phone-number.service';

describe('Service Tests', () => {
  describe('WhatsAppSourcePhoneNumber Service', () => {
    let service: WhatsAppSourcePhoneNumberService;
    let httpMock: HttpTestingController;
    let elemDefault: IWhatsAppSourcePhoneNumber;
    let expectedResult: IWhatsAppSourcePhoneNumber | IWhatsAppSourcePhoneNumber[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(WhatsAppSourcePhoneNumberService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        instanceId: 'AAAAAAA',
        msisdn: 0,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a WhatsAppSourcePhoneNumber', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new WhatsAppSourcePhoneNumber()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a WhatsAppSourcePhoneNumber', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            instanceId: 'BBBBBB',
            msisdn: 1,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a WhatsAppSourcePhoneNumber', () => {
        const patchObject = Object.assign(
          {
            instanceId: 'BBBBBB',
            msisdn: 1,
          },
          new WhatsAppSourcePhoneNumber()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of WhatsAppSourcePhoneNumber', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            instanceId: 'BBBBBB',
            msisdn: 1,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a WhatsAppSourcePhoneNumber', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addWhatsAppSourcePhoneNumberToCollectionIfMissing', () => {
        it('should add a WhatsAppSourcePhoneNumber to an empty array', () => {
          const whatsAppSourcePhoneNumber: IWhatsAppSourcePhoneNumber = { id: 123 };
          expectedResult = service.addWhatsAppSourcePhoneNumberToCollectionIfMissing([], whatsAppSourcePhoneNumber);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(whatsAppSourcePhoneNumber);
        });

        it('should not add a WhatsAppSourcePhoneNumber to an array that contains it', () => {
          const whatsAppSourcePhoneNumber: IWhatsAppSourcePhoneNumber = { id: 123 };
          const whatsAppSourcePhoneNumberCollection: IWhatsAppSourcePhoneNumber[] = [
            {
              ...whatsAppSourcePhoneNumber,
            },
            { id: 456 },
          ];
          expectedResult = service.addWhatsAppSourcePhoneNumberToCollectionIfMissing(
            whatsAppSourcePhoneNumberCollection,
            whatsAppSourcePhoneNumber
          );
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a WhatsAppSourcePhoneNumber to an array that doesn't contain it", () => {
          const whatsAppSourcePhoneNumber: IWhatsAppSourcePhoneNumber = { id: 123 };
          const whatsAppSourcePhoneNumberCollection: IWhatsAppSourcePhoneNumber[] = [{ id: 456 }];
          expectedResult = service.addWhatsAppSourcePhoneNumberToCollectionIfMissing(
            whatsAppSourcePhoneNumberCollection,
            whatsAppSourcePhoneNumber
          );
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(whatsAppSourcePhoneNumber);
        });

        it('should add only unique WhatsAppSourcePhoneNumber to an array', () => {
          const whatsAppSourcePhoneNumberArray: IWhatsAppSourcePhoneNumber[] = [{ id: 123 }, { id: 456 }, { id: 77314 }];
          const whatsAppSourcePhoneNumberCollection: IWhatsAppSourcePhoneNumber[] = [{ id: 123 }];
          expectedResult = service.addWhatsAppSourcePhoneNumberToCollectionIfMissing(
            whatsAppSourcePhoneNumberCollection,
            ...whatsAppSourcePhoneNumberArray
          );
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const whatsAppSourcePhoneNumber: IWhatsAppSourcePhoneNumber = { id: 123 };
          const whatsAppSourcePhoneNumber2: IWhatsAppSourcePhoneNumber = { id: 456 };
          expectedResult = service.addWhatsAppSourcePhoneNumberToCollectionIfMissing(
            [],
            whatsAppSourcePhoneNumber,
            whatsAppSourcePhoneNumber2
          );
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(whatsAppSourcePhoneNumber);
          expect(expectedResult).toContain(whatsAppSourcePhoneNumber2);
        });

        it('should accept null and undefined values', () => {
          const whatsAppSourcePhoneNumber: IWhatsAppSourcePhoneNumber = { id: 123 };
          expectedResult = service.addWhatsAppSourcePhoneNumberToCollectionIfMissing([], null, whatsAppSourcePhoneNumber, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(whatsAppSourcePhoneNumber);
        });

        it('should return initial array if no WhatsAppSourcePhoneNumber is added', () => {
          const whatsAppSourcePhoneNumberCollection: IWhatsAppSourcePhoneNumber[] = [{ id: 123 }];
          expectedResult = service.addWhatsAppSourcePhoneNumberToCollectionIfMissing(whatsAppSourcePhoneNumberCollection, undefined, null);
          expect(expectedResult).toEqual(whatsAppSourcePhoneNumberCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
