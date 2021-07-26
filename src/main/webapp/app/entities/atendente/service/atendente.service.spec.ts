import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAtendente, Atendente } from '../atendente.model';

import { AtendenteService } from './atendente.service';

describe('Service Tests', () => {
  describe('Atendente Service', () => {
    let service: AtendenteService;
    let httpMock: HttpTestingController;
    let elemDefault: IAtendente;
    let expectedResult: IAtendente | IAtendente[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(AtendenteService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        name: 'AAAAAAA',
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

      it('should create a Atendente', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Atendente()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Atendente', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            name: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Atendente', () => {
        const patchObject = Object.assign({}, new Atendente());

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Atendente', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            name: 'BBBBBB',
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

      it('should delete a Atendente', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addAtendenteToCollectionIfMissing', () => {
        it('should add a Atendente to an empty array', () => {
          const atendente: IAtendente = { id: 123 };
          expectedResult = service.addAtendenteToCollectionIfMissing([], atendente);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(atendente);
        });

        it('should not add a Atendente to an array that contains it', () => {
          const atendente: IAtendente = { id: 123 };
          const atendenteCollection: IAtendente[] = [
            {
              ...atendente,
            },
            { id: 456 },
          ];
          expectedResult = service.addAtendenteToCollectionIfMissing(atendenteCollection, atendente);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Atendente to an array that doesn't contain it", () => {
          const atendente: IAtendente = { id: 123 };
          const atendenteCollection: IAtendente[] = [{ id: 456 }];
          expectedResult = service.addAtendenteToCollectionIfMissing(atendenteCollection, atendente);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(atendente);
        });

        it('should add only unique Atendente to an array', () => {
          const atendenteArray: IAtendente[] = [{ id: 123 }, { id: 456 }, { id: 29160 }];
          const atendenteCollection: IAtendente[] = [{ id: 123 }];
          expectedResult = service.addAtendenteToCollectionIfMissing(atendenteCollection, ...atendenteArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const atendente: IAtendente = { id: 123 };
          const atendente2: IAtendente = { id: 456 };
          expectedResult = service.addAtendenteToCollectionIfMissing([], atendente, atendente2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(atendente);
          expect(expectedResult).toContain(atendente2);
        });

        it('should accept null and undefined values', () => {
          const atendente: IAtendente = { id: 123 };
          expectedResult = service.addAtendenteToCollectionIfMissing([], null, atendente, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(atendente);
        });

        it('should return initial array if no Atendente is added', () => {
          const atendenteCollection: IAtendente[] = [{ id: 123 }];
          expectedResult = service.addAtendenteToCollectionIfMissing(atendenteCollection, undefined, null);
          expect(expectedResult).toEqual(atendenteCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
