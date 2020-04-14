import {Injectable} from '@angular/core';
import {pagesList} from '../../pages.config';
import {ConfigService} from '../config/config.service';

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

  constructor() {
    this.pages[0].selected = true;
  }

  setSelected(index) {
    this.pages.forEach(p => p.selected = false);
    this.pages[index].selected = true;
  }
}
