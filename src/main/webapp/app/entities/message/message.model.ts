import { IAtendente } from 'app/entities/atendente/atendente.model';
import { IWhatsAppSourcePhoneNumber } from 'app/entities/whats-app-source-phone-number/whats-app-source-phone-number.model';

export interface IMessage {
  id?: number;
  body?: string;
  destinyPhoneNumber?: number;
  atendente?: IAtendente | null;
  whatsAppSourcePhoneNumber?: IWhatsAppSourcePhoneNumber | null;
}

export class Message implements IMessage {
  constructor(
    public id?: number,
    public body?: string,
    public destinyPhoneNumber?: number,
    public atendente?: IAtendente | null,
    public whatsAppSourcePhoneNumber?: IWhatsAppSourcePhoneNumber | null
  ) {}
}

export function getMessageIdentifier(message: IMessage): number | undefined {
  return message.id;
}
