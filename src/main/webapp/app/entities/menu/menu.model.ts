import { ICampaign } from 'app/entities/campaign/campaign.model';
import { ICompany } from 'app/entities/company/company.model';

export interface IMenu {
  id?: number;
  name?: string;
  json?: string;
  campaigns?: ICampaign[] | null;
  company?: ICompany | null;
}

export class Menu implements IMenu {
  constructor(
    public id?: number,
    public name?: string,
    public json?: string,
    public campaigns?: ICampaign[] | null,
    public company?: ICompany | null
  ) {}
}

export function getMenuIdentifier(menu: IMenu): number | undefined {
  return menu.id;
}
