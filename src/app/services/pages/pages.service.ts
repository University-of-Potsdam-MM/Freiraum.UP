import {Injectable} from '@angular/core';
import {pagesList} from '../../pages.config';
import {ConfigService} from '../config/config.service';
import {PageSelectedService} from '../page-selected/page-selected.service';

export const componentsList = () => {
    return pagesList.map(p => p.component);
};

@Injectable({
  providedIn: 'root'
})
export class PagesService {

  public pages = pagesList.filter(
    p => p.interactiveModes.includes(ConfigService.config.general.interactiveMode)
  );

  constructor(private pageSelected: PageSelectedService) {
    this.pages[0].selected = true;
  }

  setSelected(index) {
    this.pages.forEach(
      (p, i) => {
        p.selected = (i === index);
        if (p.selected) {
          this.pageSelected.selected.next(p.name);
        }
      }
    );
  }
}
