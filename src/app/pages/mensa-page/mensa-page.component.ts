import { Component, OnInit } from '@angular/core';
import {Meal, MensaResponse} from '../../../types/mensa.response';
import {BasicPageComponent} from '../../components/basic-page/basic-page.component';

@Component({
  selector: 'app-mensa-page',
  templateUrl: './mensa-page.component.html',
  styleUrls: ['./mensa-page.component.scss'],
})
export class MensaPageComponent extends BasicPageComponent  implements OnInit {

  selectedCanteenIndex = 0;
  meals: {[canteen: string]: Meal[]} = {};

  constructor() { super('mensa'); }

  ngOnInit() {
    for (const canteen of this.config.mensa.canteens) {
       this.api.feeds.mensa[canteen.name].subscribe(
         (response: MensaResponse) => {
           this.meals[canteen.name] = response.meal;
         }
       );
    }
  }
}
