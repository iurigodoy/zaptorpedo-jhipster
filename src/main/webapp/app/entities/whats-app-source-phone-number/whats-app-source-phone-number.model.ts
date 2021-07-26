import { IMessage } from 'app/entities/message/message.model';
import { ICampaign } from 'app/entities/campaign/campaign.model';
import { ICompany } from 'app/entities/company/company.model';

export interface IWhatsAppSourcePhoneNumber {
  id?: number;
  instanceId?: string;
  msisdn?: number;
  messages?: IMessage[] | null;
  campaigns?: ICampaign[] | null;
  company?: ICompany | null;
}

export class WhatsAppSourcePhoneNumber implements IWhatsAppSourcePhoneNumber {
  constructor(
    public id?: number,
    public instanceId?: string,
    public msisdn?: number,
    public messages?: IMessage[] | null,
    public campaigns?: ICampaign[] | null,
    public company?: ICompany | null
  ) {}
}

export function getWhatsAppSourcePhoneNumberIdentifier(whatsAppSourcePhoneNumber: IWhatsAppSourcePhoneNumber): number | undefined {
  return whatsAppSourcePhoneNumber.id;
}
