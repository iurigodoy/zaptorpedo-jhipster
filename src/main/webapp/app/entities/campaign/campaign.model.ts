import { ICampaignExecution } from 'app/entities/campaign-execution/campaign-execution.model';
import { IWhatsAppSourcePhoneNumber } from 'app/entities/whats-app-source-phone-number/whats-app-source-phone-number.model';
import { IMenu } from 'app/entities/menu/menu.model';

export interface ICampaign {
  id?: number;
  name?: string;
  template?: string;
  campaignExecutions?: ICampaignExecution[] | null;
  whatsAppSourcePhoneNumber?: IWhatsAppSourcePhoneNumber | null;
  menu?: IMenu | null;
}

export class Campaign implements ICampaign {
  constructor(
    public id?: number,
    public name?: string,
    public template?: string,
    public campaignExecutions?: ICampaignExecution[] | null,
    public whatsAppSourcePhoneNumber?: IWhatsAppSourcePhoneNumber | null,
    public menu?: IMenu | null
  ) {}
}

export function getCampaignIdentifier(campaign: ICampaign): number | undefined {
  return campaign.id;
}
