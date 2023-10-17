import { Column, Months } from '@enums';
import { Driver } from './driver.class';
import { convert as convertNumberToWordsRu } from 'number-to-words-ru';
import { Executor } from './executor.class';
import { ErrorInfo } from '../interfaces/error-info.interface';

export class RequestInfo {
  public clientInfo: string;
  public destination: string;
  public requestNumber: string;
  public price: string;
  public driver: Driver;
  public request: string;
  public date: Date;
  public startDate: string;
  public endDate: string;
  public executor: Executor;
  public error: ErrorInfo | null;
  private readonly requiredFields: Column[] = [
    Column.DESTINATION, Column.DOC_NUMBER, Column.PRICE, Column.REQUEST,
    Column.START_DATE, Column.END_DATE, Column.CLIENT, Column.EXECUTOR];

  constructor(item: any, driver: Driver, clientInfo: string, executor: Executor, sheetName: string) {
    this.error = this.getErrors(item, sheetName);
    this.destination = item[Column.DESTINATION];
    this.requestNumber = item[Column.DOC_NUMBER];
    this.price = item[Column.PRICE];
    this.request = item[Column.REQUEST];
    this.driver = driver;
    this.clientInfo = clientInfo;
    this.date = RequestInfo.excelDateToJSDate(item[Column.END_DATE]);
    this.startDate = this.getFormattedDate(RequestInfo.excelDateToJSDate(item[Column.START_DATE]));
    this.endDate = this.getFormattedDate(RequestInfo.excelDateToJSDate(item[Column.END_DATE]));
    this.executor = executor;
  }

  public get priceWords(): string {
    return convertNumberToWordsRu(this.price);
  }

  public get month(): string {
    return Months[this.date.getMonth()];
  }

  public get day(): string {
    const requestDay = this.date.getDate().toString();

    return this.handleDate(requestDay);
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

  private getFormattedDate(currentDate: Date): string {
    const day = this.handleDate(currentDate.getDate().toString());
    const month = this.handleDate((currentDate.getMonth() + 1).toString());
    const year = currentDate.getFullYear().toString();

    return `${day}.${month}.${year}`;
  }

  private handleDate(day: string): string {
    return day?.length === 1 ? `0${day}` : day;
  }

  public getErrors(request: any, sheetName: string): ErrorInfo | null {
    const emptyColumns: Column[] = this.requiredFields.filter((field: Column) => !request[field]);
    return emptyColumns?.length ? {
      sheetName,
      rowId: request.__rowNum__ + 1,
      emptyColumns
    } : null;
  }
}
