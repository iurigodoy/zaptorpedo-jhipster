jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IWhatsAppSourcePhoneNumber, WhatsAppSourcePhoneNumber } from '../whats-app-source-phone-number.model';
import { WhatsAppSourcePhoneNumberService } from '../service/whats-app-source-phone-number.service';

import { WhatsAppSourcePhoneNumberRoutingResolveService } from './whats-app-source-phone-number-routing-resolve.service';

describe('Service Tests', () => {
  describe('WhatsAppSourcePhoneNumber routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: WhatsAppSourcePhoneNumberRoutingResolveService;
    let service: WhatsAppSourcePhoneNumberService;
    let resultWhatsAppSourcePhoneNumber: IWhatsAppSourcePhoneNumber | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(WhatsAppSourcePhoneNumberRoutingResolveService);
      service = TestBed.inject(WhatsAppSourcePhoneNumberService);
      resultWhatsAppSourcePhoneNumber = undefined;
    });

    describe('resolve', () => {
      it('should return IWhatsAppSourcePhoneNumber returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultWhatsAppSourcePhoneNumber = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultWhatsAppSourcePhoneNumber).toEqual({ id: 123 });
      });

      it('should return new IWhatsAppSourcePhoneNumber if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultWhatsAppSourcePhoneNumber = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultWhatsAppSourcePhoneNumber).toEqual(new WhatsAppSourcePhoneNumber());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as WhatsAppSourcePhoneNumber })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultWhatsAppSourcePhoneNumber = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultWhatsAppSourcePhoneNumber).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
