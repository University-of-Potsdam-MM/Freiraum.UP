import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network';
import { AlertController, App, Events } from 'ionic-angular';
import { TranslateService } from "@ngx-translate/core";
import {Logger, LoggingService} from "ionic-logging-service";

/**
 * @desc Enum for connection states
 */
export enum EConnection {
  OFFLINE, ONLINE
}

/**
 * @classdesc Can be used to whether a network connection exists or not
 */
@Injectable()
export class ConnectionProvider {

  private connectionState:EConnection;
  private logger:Logger;

  constructor(private logging: LoggingService,
              private network:    Network,
              private alertCtrl:  AlertController,
              private translate:  TranslateService,
              private eventCtrl:  Events,
              private app:        App) {
    this.logger = this.logging.getLogger("FreiraumUP.ConnectionProvider");
    if(this.network.type == this.network.Connection.NONE){
      this.connectionState = EConnection.OFFLINE;
    } else {
      this.connectionState = EConnection.ONLINE;
    }
  }

  /**
   * @desc initializes the network event callbacks so network events are
   * registered. Should be called in app.component.ts
   */
  public initializeNetworkEvents(): void {
    this.network.onDisconnect().subscribe(() => {
      if (this.connectionState === EConnection.ONLINE) {
        this.eventCtrl.publish('connection:offline');
      }
      this.connectionState = EConnection.OFFLINE;
      this.logger.info(`Went ${EConnection[this.connectionState]}`);
    });
    this.network.onConnect().subscribe(() => {
      if (this.connectionState === EConnection.OFFLINE) {
        this.eventCtrl.publish('connection:online');
      }
      this.connectionState = EConnection.ONLINE;
      this.logger.info(`Went ${EConnection[this.connectionState]}`);
    });
    this.logger.info("Initialized network events")
  }


  /**
   *
   * @desc returns connection state. Set showAlert and/or sendHome to true to show an alert
   * about the connection state or/and send the user to HomePage
   *
   * @return Observable<boolean>
   */
  public checkOnline(showAlert:boolean=false, sendHome:boolean=false):EConnection {
    if (this.connectionState==EConnection.OFFLINE) {
      if(showAlert){
        let alert = this.alertCtrl.create({
          title: this.translate.instant("alert.title.error"),
          subTitle: this.translate.instant("alert.network"),
          buttons: [
            this.translate.instant("button.continue")
          ]
        });
        alert.present();
      }
      if(sendHome){
        // this.app.getRootNavs()[0].setRoot(HomePage);
      }
    }
    return this.connectionState;
  }
}
