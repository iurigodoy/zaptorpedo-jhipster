import * as dayjs from 'dayjs';
import { ICampaign } from 'app/entities/campaign/campaign.model';

export interface ICampaignExecution {
  id?: number;
  bodyContentType?: string;
  body?: string;
  sheduleDttm?: dayjs.Dayjs | null;
  executionDttm?: dayjs.Dayjs | null;
  campaign?: ICampaign | null;
}

export class CampaignExecution implements ICampaignExecution {
  constructor(
    public id?: number,
    public bodyContentType?: string,
    public body?: string,
    public sheduleDttm?: dayjs.Dayjs | null,
    public executionDttm?: dayjs.Dayjs | null,
    public campaign?: ICampaign | null
  ) {}
}

export function getCampaignExecutionIdentifier(campaignExecution: ICampaignExecution): number | undefined {
  return campaignExecution.id;
}
