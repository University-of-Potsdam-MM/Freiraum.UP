import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PageSelectedService {

  public selected: Subject<string> = new Subject<string>();

  constructor() { }
}
