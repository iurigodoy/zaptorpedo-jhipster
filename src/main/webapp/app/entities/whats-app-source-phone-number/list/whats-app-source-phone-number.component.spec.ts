import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { WhatsAppSourcePhoneNumberService } from '../service/whats-app-source-phone-number.service';

import { WhatsAppSourcePhoneNumberComponent } from './whats-app-source-phone-number.component';

describe('Component Tests', () => {
  describe('WhatsAppSourcePhoneNumber Management Component', () => {
    let comp: WhatsAppSourcePhoneNumberComponent;
    let fixture: ComponentFixture<WhatsAppSourcePhoneNumberComponent>;
    let service: WhatsAppSourcePhoneNumberService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [WhatsAppSourcePhoneNumberComponent],
      })
        .overrideTemplate(WhatsAppSourcePhoneNumberComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(WhatsAppSourcePhoneNumberComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(WhatsAppSourcePhoneNumberService);

      const headers = new HttpHeaders().append('link', 'link;link');
      jest.spyOn(service, 'query').mockReturnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.whatsAppSourcePhoneNumbers?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
