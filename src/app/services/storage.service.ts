import { Injectable } from '@angular/core';
import { Driver } from '@models';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  public managers: string[] = [];
  public drivers: Driver[] = [];
  public clients: {[key: string]: string} = {};
}
