import { Driver, Executor } from '@models';
import { ErrorInfo } from './error-info.interface';

export interface DocumentInfo {
  drivers: Driver[];
  clients: {[key: string]: string};
  managers: string[];
  executors: {[key: string]: Executor};
  errors: ErrorInfo[];
}
