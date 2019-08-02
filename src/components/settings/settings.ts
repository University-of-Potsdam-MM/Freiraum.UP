import {Component, OnInit} from '@angular/core';
import {IAppConfig} from "../../interfaces/IAppConfig";
import {ConfigProvider} from "../../providers/config/config";
import {TranslateService} from "@ngx-translate/core";
import {Events} from "ionic-angular";

/**
 * Component for setting selection
 */
@Component({
  selector: 'settings',
  templateUrl: 'settings.html'
})
export class SettingsComponent implements OnInit {

  /**
   * currently selected language
   */
  language:string;

  /**
   * App config
   */
  config:IAppConfig = ConfigProvider.config;

  constructor(private translate: TranslateService,
              private events: Events) {

  }

  ngOnInit(){
    this.events.subscribe("reset",() => { this.reset()})
    this.translate.onLangChange.subscribe(c=>console.log(c))
  }

  reset(){
    this.translate.use("de")
  }

  /**
   * triggered when laguage is changed.
   * @desc upon change the currently used language for i18n is changed
   * @param {string} lang
   */
  languageChanged(lang:string){
    this.translate.use(lang);
  }
}
