import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { Column, Page } from '@enums';
import { Driver, RequestInfo } from '@models';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class ExcelParserService {
  private readonly unreadyStatus: string = 'не созданы';

  constructor(private readonly storageService: StorageService) { }

  public parseDocument(excelDocument: XLSX.WorkBook): { drivers: Driver[], clients: {[key: string]: string}, managers: string[] } {
    this.storageService.managers = this.getAllManagers(excelDocument);
    this.storageService.drivers = this.getAllDrivers(excelDocument);
    this.storageService.clients = this.getAllClients(excelDocument);

    return {
      managers: this.storageService.managers,
      drivers: this.storageService.drivers,
      clients: this.storageService.clients
    }
  }

  public getRequests(excelDocument: XLSX.WorkBook, drivers: {[key: string]: Driver}, clients: {[key: string]: string}): RequestInfo[] {
    const items: RequestInfo[] = [];

    Object.keys(drivers).forEach(driverName => {
      const sheetName = excelDocument.SheetNames.find((sheetName: string) => sheetName.toLowerCase().includes(drivers[driverName]?.lastName.toLowerCase()));

      if (sheetName) {
        const sheetData: XLSX.WorkSheet = excelDocument.Sheets[sheetName];

        const fileItems = XLSX.utils.sheet_to_json<{[key: string]: string}>(sheetData)
          .filter((item: {[key: string]: string}) => {
            return Object.keys(item).includes(Column.IS_READY) && item[Column.IS_READY] === this.unreadyStatus;
          }).map((item: any) => {
            return new RequestInfo(item, drivers[driverName], clients[item[Column.CLIENT]]);
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
      return new Driver(item);
    });
  }

  private getAllClients(excelDocument: XLSX.WorkBook): {[key: string]: string} {
    const sheetClientsData: XLSX.WorkSheet = excelDocument.Sheets[Page.CLIENTS];
    const clientsData = XLSX.utils.sheet_to_json<{[key: string]: string}>(sheetClientsData);
    const clients: {[key: string]: string} = {};

    clientsData.forEach((item: any) => {
      clients[item[Column.NAME]] = item[Column.INFO];
    })

    return clients;
  }

  private getAllManagers(excelDocument: XLSX.WorkBook): string[] {
    const sheetManagersData: XLSX.WorkSheet = excelDocument.Sheets[Page.MANAGERS];
    const managerData = XLSX.utils.sheet_to_json<{[key: string]: string}>(sheetManagersData);

    return managerData.map((item: any) => item[Column.FULL_NAME])
  }
}
