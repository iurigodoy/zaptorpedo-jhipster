import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { WhatsAppSourcePhoneNumberDetailComponent } from './whats-app-source-phone-number-detail.component';

describe('Component Tests', () => {
  describe('WhatsAppSourcePhoneNumber Management Detail Component', () => {
    let comp: WhatsAppSourcePhoneNumberDetailComponent;
    let fixture: ComponentFixture<WhatsAppSourcePhoneNumberDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [WhatsAppSourcePhoneNumberDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ whatsAppSourcePhoneNumber: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(WhatsAppSourcePhoneNumberDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(WhatsAppSourcePhoneNumberDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load whatsAppSourcePhoneNumber on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.whatsAppSourcePhoneNumber).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
