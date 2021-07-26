import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { AtendenteService } from '../service/atendente.service';

import { AtendenteComponent } from './atendente.component';

describe('Component Tests', () => {
  describe('Atendente Management Component', () => {
    let comp: AtendenteComponent;
    let fixture: ComponentFixture<AtendenteComponent>;
    let service: AtendenteService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [AtendenteComponent],
      })
        .overrideTemplate(AtendenteComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(AtendenteComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(AtendenteService);

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
      expect(comp.atendentes?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
