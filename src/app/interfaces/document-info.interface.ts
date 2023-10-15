import { Driver, Executor } from '@models';

export interface DocumentInfo {
  drivers: Driver[];
  clients: {[key: string]: string};
  managers: string[];
  executors: {[key: string]: Executor};
}
