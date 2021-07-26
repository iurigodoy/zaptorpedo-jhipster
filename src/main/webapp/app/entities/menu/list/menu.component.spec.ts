import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { MenuService } from '../service/menu.service';

import { MenuComponent } from './menu.component';

describe('Component Tests', () => {
  describe('Menu Management Component', () => {
    let comp: MenuComponent;
    let fixture: ComponentFixture<MenuComponent>;
    let service: MenuService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [MenuComponent],
      })
        .overrideTemplate(MenuComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(MenuComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(MenuService);

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
      expect(comp.menus?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
