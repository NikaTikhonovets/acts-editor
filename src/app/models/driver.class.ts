import { Column } from '@enums';

export class Driver {
  public firstName: string;
  public lastName: string;
  public patronymic: string;
  public car: string;
  public manager: string;

  constructor(driver: any) {
    this.firstName = driver[Column.FIRST_NAME];
    this.lastName = driver[Column.LAST_NAME];
    this.patronymic = driver[Column.PATRONYMIC];
    this.car = driver[Column.CAR];
    this.manager = driver[Column.MANAGER];
  }

  public get fullName(): string {
    return `${this.lastName} ${this.firstName} ${this.patronymic}`;
  }

  public get shortName(): string {
    const [nameFirstLetter]: string = this.firstName;
    const [patronymicFirstLetter]: string = this.patronymic;
    return `${this.lastName} ${nameFirstLetter}.${patronymicFirstLetter}.`;
  }
}
