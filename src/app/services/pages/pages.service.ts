import {Injectable} from '@angular/core';
import {pagesList} from '../../pages.config';
import {ConfigService} from '../config/config.service';
import {PageSelectedService} from '../page-selected/page-selected.service';

export const componentsList = () => {
    return pagesList.map(p => p.component);
};

/**
 * This service handles the available pages and is used for selecting a page.
 */
@Injectable({
  providedIn: 'root'
})
export class PagesService {

  /* fills the services pages array with pages that support the current value of 'interactiveMode' */
  public pages = pagesList.filter(
    p => p.interactiveModes.includes(ConfigService.config.general.interactiveMode)
  );

  constructor(private pageSelected: PageSelectedService) {
    this.pages[0].selected = true;
  }

  /**
   * sets the page at 'index' as selected and sigals this selection to outside subscribers. Actually only used
   * to tell pages that they are currently in focus
   * @param index: index of the page to select
   */
  setSelected(index) {
    this.pages.forEach(
      (p, i) => {
        // select the page that is to be selected and deselect the others
        p.selected = (i === index);

        // signal selection to the outside
        if (p.selected) {
          this.pageSelected.selected.next(p.name);
        }
      }
    );
  }
}
