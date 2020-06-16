import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';

/**
 * This service is used to communicate with instances of pages. This way we can tell a page that it has
 * been selected.
 */
@Injectable({
  providedIn: 'root'
})
export class PageSelectedService {

  public selected: Subject<string> = new Subject<string>();
  public title: Subject<string> = new Subject<string>();

  constructor() { }
}
