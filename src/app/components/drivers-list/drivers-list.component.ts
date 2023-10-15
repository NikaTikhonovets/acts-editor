import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as XLSX from 'xlsx';
import { DocumentService, ExcelParserService } from '@services';
import { Driver } from '@models';

@Component({
  selector: 'app-drivers-list',
  templateUrl: './drivers-list.component.html',
  styleUrls: ['./drivers-list.component.scss']
})
export class DriversListComponent implements OnInit {
  @Input() uploadedDocument!: XLSX.WorkBook | undefined;
  @Output() goBack: EventEmitter<void> = new EventEmitter<void>();

  public drivers: Driver[] = [];
  public managers: string[] = [];
  public clients: {[key: string]: string} = {};
  public driversByManager: {[key: string]: Driver[]} = {};
  public selectedDrivers: string[] = [];
  public isSuccessGenerated: boolean = false;

  constructor(private readonly parserService: ExcelParserService,
              private readonly documentService: DocumentService) {}

  public ngOnInit(): void {
    if (!this.uploadedDocument) {
      return;
    }

    const {drivers, managers, clients} = this.parserService.parseDocument(this.uploadedDocument);
    this.drivers = drivers;
    this.managers = managers;
    this.clients = clients;
    this.managers.forEach((manager: string) => {
      this.driversByManager[manager] = this.drivers.filter((driver: Driver) => driver.manager === manager);
    })
    this.selectedDrivers = this.drivers.map((driver: Driver) => driver.shortName);
  }

  public return(): void {
    this.goBack.emit();
  }

  public checkSelected(driver: Driver): boolean {
    return this.selectedDrivers.includes(driver.shortName);
  }

  public checkIsSelectedManager(manager: string): boolean {
    return this.driversByManager[manager].every((driver: Driver) => this.selectedDrivers.includes(driver.shortName));
  }

  public generateDocs(): void {
    if (!this.uploadedDocument) {
      return;
    }

    const drivers: {[key: string]: Driver} = {};
    this.drivers
      .filter((driver: Driver) => this.selectedDrivers.includes(driver.shortName))
      .forEach((driver: Driver) => drivers[driver.shortName] = driver);

    const items = this.parserService.getRequests(this.uploadedDocument, drivers, this.clients);

    this.documentService.createActs(items).then(() => {
      this.isSuccessGenerated = true;
    });
  }

  public selectAllDrivers(): void {
    this.selectedDrivers = [];

    Object.keys(this.driversByManager).forEach((key: string) => {
      this.selectedDrivers.push(...this.driversByManager[key].map((driver: Driver) => driver.shortName));
    })
  }

  public updateSelectedDriversByManager(manager: string, target: EventTarget | null): void {
    const isChecked = (target as any)?.checked;
    const newDrivers: string[] = this.driversByManager[manager].map((driver: Driver) => driver.shortName);

    this.updateSelectedDrivers(isChecked, newDrivers);
  }

  public updateSelectedDriversByDriver(driverName: string, target: EventTarget | null): void {
    const isChecked = (target as any)?.checked;
    this.updateSelectedDrivers(isChecked, [driverName]);
  }

  private updateSelectedDrivers(isChecked: boolean, newDrivers: string[]): void {
    if (isChecked) {
      this.selectedDrivers = [...new Set([...this.selectedDrivers, ...newDrivers])];
    } else {
      this.selectedDrivers = this.selectedDrivers.filter((driver: string) => !newDrivers.includes(driver));
    }
  }
}
