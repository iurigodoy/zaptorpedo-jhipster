import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ICampaignExecution, CampaignExecution } from '../campaign-execution.model';

import { CampaignExecutionService } from './campaign-execution.service';

describe('Service Tests', () => {
  describe('CampaignExecution Service', () => {
    let service: CampaignExecutionService;
    let httpMock: HttpTestingController;
    let elemDefault: ICampaignExecution;
    let expectedResult: ICampaignExecution | ICampaignExecution[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(CampaignExecutionService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        bodyContentType: 'image/png',
        body: 'AAAAAAA',
        sheduleDttm: currentDate,
        executionDttm: currentDate,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            sheduleDttm: currentDate.format(DATE_TIME_FORMAT),
            executionDttm: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a CampaignExecution', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            sheduleDttm: currentDate.format(DATE_TIME_FORMAT),
            executionDttm: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            sheduleDttm: currentDate,
            executionDttm: currentDate,
          },
          returnedFromService
        );

        service.create(new CampaignExecution()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a CampaignExecution', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            body: 'BBBBBB',
            sheduleDttm: currentDate.format(DATE_TIME_FORMAT),
            executionDttm: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            sheduleDttm: currentDate,
            executionDttm: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a CampaignExecution', () => {
        const patchObject = Object.assign(
          {
            body: 'BBBBBB',
          },
          new CampaignExecution()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            sheduleDttm: currentDate,
            executionDttm: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of CampaignExecution', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            body: 'BBBBBB',
            sheduleDttm: currentDate.format(DATE_TIME_FORMAT),
            executionDttm: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            sheduleDttm: currentDate,
            executionDttm: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a CampaignExecution', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addCampaignExecutionToCollectionIfMissing', () => {
        it('should add a CampaignExecution to an empty array', () => {
          const campaignExecution: ICampaignExecution = { id: 123 };
          expectedResult = service.addCampaignExecutionToCollectionIfMissing([], campaignExecution);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(campaignExecution);
        });

        it('should not add a CampaignExecution to an array that contains it', () => {
          const campaignExecution: ICampaignExecution = { id: 123 };
          const campaignExecutionCollection: ICampaignExecution[] = [
            {
              ...campaignExecution,
            },
            { id: 456 },
          ];
          expectedResult = service.addCampaignExecutionToCollectionIfMissing(campaignExecutionCollection, campaignExecution);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a CampaignExecution to an array that doesn't contain it", () => {
          const campaignExecution: ICampaignExecution = { id: 123 };
          const campaignExecutionCollection: ICampaignExecution[] = [{ id: 456 }];
          expectedResult = service.addCampaignExecutionToCollectionIfMissing(campaignExecutionCollection, campaignExecution);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(campaignExecution);
        });

        it('should add only unique CampaignExecution to an array', () => {
          const campaignExecutionArray: ICampaignExecution[] = [{ id: 123 }, { id: 456 }, { id: 56361 }];
          const campaignExecutionCollection: ICampaignExecution[] = [{ id: 123 }];
          expectedResult = service.addCampaignExecutionToCollectionIfMissing(campaignExecutionCollection, ...campaignExecutionArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const campaignExecution: ICampaignExecution = { id: 123 };
          const campaignExecution2: ICampaignExecution = { id: 456 };
          expectedResult = service.addCampaignExecutionToCollectionIfMissing([], campaignExecution, campaignExecution2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(campaignExecution);
          expect(expectedResult).toContain(campaignExecution2);
        });

        it('should accept null and undefined values', () => {
          const campaignExecution: ICampaignExecution = { id: 123 };
          expectedResult = service.addCampaignExecutionToCollectionIfMissing([], null, campaignExecution, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(campaignExecution);
        });

        it('should return initial array if no CampaignExecution is added', () => {
          const campaignExecutionCollection: ICampaignExecution[] = [{ id: 123 }];
          expectedResult = service.addCampaignExecutionToCollectionIfMissing(campaignExecutionCollection, undefined, null);
          expect(expectedResult).toEqual(campaignExecutionCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
