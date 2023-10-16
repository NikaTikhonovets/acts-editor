import { Column } from '@enums';

export interface ErrorInfo {
  sheetName: string;
  rowId: string;
  emptyColumns: Column[];
}
