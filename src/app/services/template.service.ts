import { Injectable } from '@angular/core';
import { RequestInfo } from '@models';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {

  public getActTemplateFields(requestInfo: RequestInfo): {[key: string]: string} {
    return {
      '{{PRICE}}': requestInfo.price,
      '{{PRICE_WORD}}': requestInfo.priceWords,
      '{{DRIVER}}': requestInfo.driver.fullName,
      '{{CAR}}': requestInfo.driver.car,
      '{{DESTINATION}}': requestInfo.destination,
      '{{REQUEST}}': requestInfo.request,
      '{{DOC_NUMBER}}': requestInfo.requestNumber,
      '{{CLIENT}}': requestInfo.clientInfo,
      '{{DAY}}': requestInfo.day,
      '{{MONTH}}': requestInfo.month,
      '{{YEAR}}': requestInfo.date.getFullYear().toString(),
    }
  }
}
