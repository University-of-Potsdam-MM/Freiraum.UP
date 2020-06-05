import { Pipe, PipeTransform } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Pipe({
  name: 'pageName'
})
export class PageNamePipe implements PipeTransform {

  constructor(private translate: TranslateService) {}

  transform(pageName: any, ...args: any[]): any {
    return this.translate.instant(`page.${pageName}.title`);
  }

}
