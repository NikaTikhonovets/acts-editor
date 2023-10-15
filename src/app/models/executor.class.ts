import { Column } from '@enums';

export class Executor {
  public name: string;
  public address: string;
  public phones: string;
  public mail: string;
  public inn: string;
  public ogrn: string;
  public accountR: string;
  public accountC: string;
  public bic: string;
  public bank: string;
  public id: string;
  public director: string;

  constructor(item: any) {
    this.name = item[Column.NAME];
    this.address = item[Column.ADDRESS];
    this.phones = item[Column.PHONES];
    this.mail = item[Column.MAIL];
    this.inn = item[Column.INN];
    this.ogrn = item[Column.OGRN];
    this.accountR = item[Column.ACCOUNT_R];
    this.accountC = item[Column.ACCOUNT_C];
    this.bic = item[Column.BIC];
    this.bank = item[Column.BANK];
    this.id = item[Column.ID];
    this.director = item[Column.DIRECTOR];
  }
}
