import { Component, OnInit } from '@angular/core';
import {Meal, MensaResponse} from '../../../types/mensa.response';
import {BasicPageComponent} from '../../components/basic-page/basic-page.component';
import {iterableArray} from '../../util/iterableArray';

@Component({
  selector: 'app-mensa-page',
  templateUrl: './mensa-page.component.html',
  styleUrls: ['./mensa-page.component.scss'],
})
export class MensaPageComponent extends BasicPageComponent  implements OnInit {

  selectedCanteenIndex = 0;
  meals: {[canteen: string]: Meal[]} = {};
  canteensIterator;
  enabledCanteens = [];

  constructor() { super('mensa'); }

  ngOnInit() {
    this.enabledCanteens = this.config.mensa.canteens.filter(m => m.enabled);
    for (const canteen of this.enabledCanteens) {
       this.api.feeds.mensa[canteen.name].subscribe(
         (response: MensaResponse) => {
           this.meals[canteen.name] = response.meal;
         }
       );
    }

    if (this.config.mensa.canteens.length > 1) {
      this.canteensIterator = iterableArray(this.enabledCanteens);
    }
  }

  onSelected() {
    if (this.canteensIterator) {
      this.selectedCanteenIndex = this.enabledCanteens.indexOf(this.canteensIterator.next().value);
    }
  }
}
