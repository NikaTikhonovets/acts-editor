import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { Column, Page } from '@enums';
import { Driver, Executor, RequestInfo } from '@models';
import { DocumentInfo } from '../interfaces/document-info.interface';
import { ErrorInfo } from '../interfaces/error-info.interface';

@Injectable({
  providedIn: 'root'
})
export class ExcelParserService {
  public documentErrors: ErrorInfo[] = [];
  private readonly unreadyStatus: string = 'не созданы';

  public parseDocument(excelDocument: XLSX.WorkBook): DocumentInfo {
    this.documentErrors = [];

    return {
      managers: this.getAllManagers(excelDocument),
      drivers: this.getAllDrivers(excelDocument),
      clients: this.getAllClients(excelDocument),
      executors: this.getAllExecutors(excelDocument),
      errors: this.documentErrors
    };
  }

  public getRequests(excelDocument: XLSX.WorkBook, drivers: {[key: string]: Driver}, clients: {[key: string]: string}, executors: {[key: string]: Executor}): RequestInfo[] {
    const items: RequestInfo[] = [];

    Object.keys(drivers).forEach(driverName => {
      const sheetName = excelDocument.SheetNames.find((sheetName: string) => this.handleName(sheetName).includes(this.handleName(drivers[driverName].shortName)));

      if (sheetName) {
        const sheetData: XLSX.WorkSheet = excelDocument.Sheets[sheetName];

        const fileItems = XLSX.utils.sheet_to_json<{[key: string]: string}>(sheetData)
          .filter((item: {[key: string]: string}) => {
            return Object.keys(item).includes(Column.IS_READY) && item[Column.IS_READY] === this.unreadyStatus;
          }).map((item: any) => {
            return new RequestInfo(item, drivers[driverName], clients[item[Column.CLIENT]], executors[item[Column.EXECUTOR]]);
          });

        items.push(...fileItems);
      }
    });

    return items;
  }

  private getAllDrivers(excelDocument: XLSX.WorkBook): Driver[] {
    const sheetDriversData: XLSX.WorkSheet = excelDocument.Sheets[Page.DRIVERS];
    const driversData = XLSX.utils.sheet_to_json<{[key: string]: string}>(sheetDriversData);

    return driversData.map((item: any) => {
      const driver = new Driver(item);
      if (driver.error) {
        this.documentErrors.push(driver.error);
      }

      return driver;
    });
  }

  private getAllClients(excelDocument: XLSX.WorkBook): {[key: string]: string} {
    const sheetClientsData: XLSX.WorkSheet = excelDocument.Sheets[Page.CLIENTS];
    const clientsData = XLSX.utils.sheet_to_json<{[key: string]: string}>(sheetClientsData);
    const clients: {[key: string]: string} = {};

    clientsData.forEach((item: any) => {
        const emptyColumns: Column[] = [Column.NAME, Column.INFO].filter((field: Column) => !item[field]);

        if (emptyColumns?.length) {
          this.documentErrors.push({
            sheetName: Page.CLIENTS,
            rowId: item.__rowNum__,
            emptyColumns
          });
        }

      clients[item[Column.NAME]] = item[Column.INFO];
    })

    return clients;
  }

  private getAllManagers(excelDocument: XLSX.WorkBook): string[] {
    const sheetManagersData: XLSX.WorkSheet = excelDocument.Sheets[Page.MANAGERS];
    const managerData = XLSX.utils.sheet_to_json<{[key: string]: string}>(sheetManagersData);

    return managerData.map((item: any) => item[Column.FULL_NAME])
  }

  private getAllExecutors(excelDocument: XLSX.WorkBook): {[key: string]: Executor} {
    const sheetExecutorsData: XLSX.WorkSheet = excelDocument.Sheets[Page.EXECUTORS];
    const executorsData = XLSX.utils.sheet_to_json<{[key: string]: string}>(sheetExecutorsData);
    const executors: {[key: string]: Executor} = {};

    executorsData.forEach((item: any) => {
      const executor: Executor = new Executor(item);
      if (executor.error) {
        this.documentErrors.push(executor.error);
      }

      executors[executor.name] = executor;
    });

    return executors;
  }

  private handleName(currentString: string): string {
    return currentString.trim().toLowerCase().replaceAll(' ', '');
  }
}
