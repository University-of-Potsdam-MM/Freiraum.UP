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

  private config = ConfigService.config;

  /* fills the services pages array with pages that support the current value of 'interactiveMode' */
  public pages;

  constructor(private pageSelected: PageSelectedService) {
    this.pages = pagesList
      // filter out pages that dont support the current value of interactiveMode
      .filter(
        p => {
          let forceEnabled = false;
          try { forceEnabled = this.config[p.name].force_enabled; } catch (e) { /* dont care, will stay false */ }
          return p.interactiveModes.includes(ConfigService.config.general.interactiveMode) || forceEnabled;
        }
      )
      // filter out pages that are either not configured via config.json or that are marked as disabled
      .filter(
        p => this.config[p.name] && (this.config[p.name].disabled === false || this.config[p.name].disabled === undefined)
      )
      // sort pages first by order (if present) and secondly by name
      .sort(
        (item1, item2) => {
          const item1order = this.config[item1.name] && (this.config[item1.name].order !== undefined) ? this.config[item1.name].order : 999;
          const item2order = this.config[item2.name] && (this.config[item2.name].order !== undefined) ? this.config[item2.name].order : 999;
          return item1order - item2order || (item1.name < item2.name ? -1 : (item1.name > item2.name ? 1 : 0));
        }
      );
    console.log(this.pages)

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
