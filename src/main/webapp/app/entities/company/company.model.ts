import { IAtendente } from 'app/entities/atendente/atendente.model';
import { IWhatsAppSourcePhoneNumber } from 'app/entities/whats-app-source-phone-number/whats-app-source-phone-number.model';
import { IMenu } from 'app/entities/menu/menu.model';

export interface ICompany {
  id?: number;
  name?: string;
  atendentes?: IAtendente[] | null;
  whatsAppSourcePhoneNumbers?: IWhatsAppSourcePhoneNumber[] | null;
  menus?: IMenu[] | null;
}

export class Company implements ICompany {
  constructor(
    public id?: number,
    public name?: string,
    public atendentes?: IAtendente[] | null,
    public whatsAppSourcePhoneNumbers?: IWhatsAppSourcePhoneNumber[] | null,
    public menus?: IMenu[] | null
  ) {}
}

export function getCompanyIdentifier(company: ICompany): number | undefined {
  return company.id;
}
