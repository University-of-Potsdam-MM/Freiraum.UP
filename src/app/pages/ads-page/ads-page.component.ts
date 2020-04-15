import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BasicPageComponent} from '../../components/basic-page/basic-page.component';
import * as moment from 'moment';
import {Ad, AdsConfig} from '../../../types/Ads';

/**
 *
 */
@Component({
  selector: 'app-ads-page',
  templateUrl: './ads-page.component.html',
  styleUrls: ['./ads-page.component.scss'],
})
export class AdsPageComponent extends BasicPageComponent implements OnInit {

  ads: Ad[] = [];
  currentAdIndex = 0;

  constructor(private http: HttpClient) { super(); }

  async ngOnInit() {
    this.http.get<AdsConfig>('assets/ads/ads-config.json').subscribe(
      adsConfig => {
        if (adsConfig.ads && adsConfig.ads.length > 0) {
          for (const ad of adsConfig.ads) {
            if (ad.name && ad.startDate && ad.endDate) {
              // @ts-ignore 'text' is a valid responseType
              this.http.get<string>(`assets/ads/${ad.name}.html`, {responseType: 'text'}).subscribe(
                adHTML => {
                  this.ads.push({
                    html: adHTML,
                    startDate: moment(ad.startDate).toISOString(),
                    endDate: moment(ad.endDate).toISOString()
                  });
                },
                error => {
                  console.log(`HTML for ad '${ad.name}' could not be loaded. Error: <${JSON.stringify(error)}>`);
                }
              );
            } else {
              console.log('Ad element not properly formatted');
            }
          }
        }
      },
      error => {
        console.log('could not get ads config');
      }
    );
  }

  nextAd() {
    this.currentAdIndex > (this.ads.length - 1)
      ? this.currentAdIndex = 0
      : this.currentAdIndex += 1;
  }

}
