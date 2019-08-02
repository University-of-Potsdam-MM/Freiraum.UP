import {AfterViewInit, Component, Input} from '@angular/core';
import {IAppConfig} from "../../interfaces/IAppConfig";
import {ConfigProvider} from "../../providers/config/config";
import {IMeals, IMensaIconMap, IMensaResponse} from "../../interfaces/IMensa";
import {Events} from "ionic-angular";
import {TranslateService} from "@ngx-translate/core";
import * as moment from "moment";

/**
 * Generated class for the MensaComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'mensa',
  templateUrl: 'mensa.html'
})
export class MensaComponent implements AfterViewInit{

  @Input("canteens") canteens : string[];

  canteen = "Mensa";
  config:IAppConfig = ConfigProvider.config;
  iconHashmap;

  meals:{mensa:IMeals[], ulf:IMeals[]} = {
    mensa: [],
    ulf: []
  };

  constructor(
    private events: Events,
    private translate: TranslateService,
    private swipeEvent: Events) {
  }

  canteenChanged(event){
    this.canteen = event;
    this.events.publish("userInput:clickedButton", {name:event})
  }

  ngAfterViewInit(){

    this.events.subscribe("webservice:mensa:Griebnitzsee",
      (response:IMensaResponse)=>{
        this.iconHashmap = {};
        for(let e of response.iconHashMap.entry) {
          this.iconHashmap[e.key] = e.value
        }

        const today = moment();
        this.meals.mensa = response.meal.filter(
          meal => today.isSame(meal.date, "date")
        );
      }
    );

    this.events.subscribe("webservice:mensa:UlfsCafe",
      (response:IMensaResponse)=>{
        const today = moment();
        this.meals.ulf = response.meal.filter(
          meal => today.isSame(meal.date, "date")
        );
      }
    );

    this.events.subscribe(
      "reset",
      () => { this.canteen = "Mensa"}
    )
  }
}
