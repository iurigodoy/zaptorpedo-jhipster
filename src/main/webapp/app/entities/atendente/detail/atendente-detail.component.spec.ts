import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AtendenteDetailComponent } from './atendente-detail.component';

describe('Component Tests', () => {
  describe('Atendente Management Detail Component', () => {
    let comp: AtendenteDetailComponent;
    let fixture: ComponentFixture<AtendenteDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [AtendenteDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ atendente: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(AtendenteDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(AtendenteDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load atendente on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.atendente).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
