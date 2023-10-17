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
      '{{START_DATE}}': requestInfo.startDate,
      '{{END_DATE}}': requestInfo.endDate,
      '{{EXECUTOR_NAME}}': requestInfo.executor.name,
      '{{EXECUTOR_ADDRESS}}': requestInfo.executor.address,
      '{{EXECUTOR_PHONES}}': requestInfo.executor.phones,
      '{{EXECUTOR_MAIL}}': requestInfo.executor.mail,
      '{{EXECUTOR_INN}}': requestInfo.executor.inn,
      '{{EXECUTOR_CPP}}': requestInfo.executor.cpp,
      '{{EXECUTOR_OGRN}}': requestInfo.executor.ogrn,
      '{{EXECUTOR_ACCOUNT_R}}': requestInfo.executor.accountR,
      '{{EXECUTOR_ACCOUNT_C}}': requestInfo.executor.accountC,
      '{{EXECUTOR_BANK}}': requestInfo.executor.bank,
      '{{EXECUTOR_BIC}}': requestInfo.executor.bic,
      '{{EXECUTOR_DIRECTOR}}': requestInfo.executor.director,
    }
  }
}
