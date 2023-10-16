import { Column, Page } from '@enums';
import { ErrorInfo } from '../interfaces/error-info.interface';

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
  public error: ErrorInfo | null;
  private readonly requiredFields: Column[] = [
    Column.NAME, Column.ADDRESS, Column.PHONES, Column.MAIL, Column.INN, Column.OGRN,
    Column.ACCOUNT_R, Column.ACCOUNT_C, Column.BIC, Column.BANK, Column.ID, Column.DIRECTOR];

  constructor(item: any) {
    this.error = this.getErrors(item);
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

  public getErrors(item: any): ErrorInfo | null {
    const emptyColumns: Column[] = this.requiredFields.filter((field: Column) => !item[field]);
    return emptyColumns?.length ? {
      sheetName: Page.EXECUTORS,
      rowId: item.__rowNum__,
      emptyColumns
    } : null;
  }
}
