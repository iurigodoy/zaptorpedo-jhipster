import { IMessage } from 'app/entities/message/message.model';
import { ICompany } from 'app/entities/company/company.model';

export interface IAtendente {
  id?: number;
  name?: string;
  messages?: IMessage[] | null;
  company?: ICompany | null;
}

export class Atendente implements IAtendente {
  constructor(public id?: number, public name?: string, public messages?: IMessage[] | null, public company?: ICompany | null) {}
}

export function getAtendenteIdentifier(atendente: IAtendente): number | undefined {
  return atendente.id;
}
