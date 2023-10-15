import { Column, Months } from '@enums';
import { Driver } from './driver.class';
import { convert as convertNumberToWordsRu } from 'number-to-words-ru';

export class RequestInfo {
  public clientInfo: string;
  public destination: string;
  public requestNumber: string;
  public price: string;
  public driver: Driver;
  public request: string;
  public date: Date;

  constructor(item: any, driver: Driver, clientInfo: string) {
    this.destination = item[Column.DESTINATION];
    this.requestNumber = item[Column.DOC_NUMBER];
    this.price = item[Column.PRICE];
    this.request = item[Column.REQUEST];
    this.driver = driver;
    this.clientInfo = clientInfo;
    this.date = RequestInfo.excelDateToJSDate(item[Column.DATE]);
  }

  public get priceWords(): string {
    return convertNumberToWordsRu(this.price);
  }

  public get month(): string {
    return Months[this.date.getMonth()];
  }

  public get day(): string {
    const requestDay = this.date.getDay().toString();

    return requestDay?.length === 1 ? `0${requestDay}` : requestDay;
  }

  private static excelDateToJSDate(serial: number): Date {
    const utc_days  = Math.floor(serial - 25569);
    const utc_value = utc_days * 86400;
    const date_info = new Date(utc_value * 1000);
    const fractional_day = serial - Math.floor(serial) + 0.0000001;
    let total_seconds = Math.floor(86400 * fractional_day);
    const seconds = total_seconds % 60;

    total_seconds -= seconds;

    const hours = Math.floor(total_seconds / (60 * 60));
    const minutes = Math.floor(total_seconds / 60) % 60;

    return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds);
  }
}
