jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { ICampaignExecution, CampaignExecution } from '../campaign-execution.model';
import { CampaignExecutionService } from '../service/campaign-execution.service';

import { CampaignExecutionRoutingResolveService } from './campaign-execution-routing-resolve.service';

describe('Service Tests', () => {
  describe('CampaignExecution routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: CampaignExecutionRoutingResolveService;
    let service: CampaignExecutionService;
    let resultCampaignExecution: ICampaignExecution | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(CampaignExecutionRoutingResolveService);
      service = TestBed.inject(CampaignExecutionService);
      resultCampaignExecution = undefined;
    });

    describe('resolve', () => {
      it('should return ICampaignExecution returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultCampaignExecution = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultCampaignExecution).toEqual({ id: 123 });
      });

      it('should return new ICampaignExecution if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultCampaignExecution = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultCampaignExecution).toEqual(new CampaignExecution());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as CampaignExecution })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultCampaignExecution = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultCampaignExecution).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
