import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { CampaignExecutionService } from '../service/campaign-execution.service';

import { CampaignExecutionComponent } from './campaign-execution.component';

describe('Component Tests', () => {
  describe('CampaignExecution Management Component', () => {
    let comp: CampaignExecutionComponent;
    let fixture: ComponentFixture<CampaignExecutionComponent>;
    let service: CampaignExecutionService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [CampaignExecutionComponent],
      })
        .overrideTemplate(CampaignExecutionComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CampaignExecutionComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(CampaignExecutionService);

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
      expect(comp.campaignExecutions?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
