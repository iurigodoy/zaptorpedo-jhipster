import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { CampaignService } from '../service/campaign.service';

import { CampaignComponent } from './campaign.component';

describe('Component Tests', () => {
  describe('Campaign Management Component', () => {
    let comp: CampaignComponent;
    let fixture: ComponentFixture<CampaignComponent>;
    let service: CampaignService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [CampaignComponent],
      })
        .overrideTemplate(CampaignComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CampaignComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(CampaignService);

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
      expect(comp.campaigns?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
