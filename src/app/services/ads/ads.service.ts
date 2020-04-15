import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Ad, AdsConfig} from '../../../types/Ads';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class AdsService {

  config;

  constructor(private http: HttpClient) { }

  getAds(): Promise<Ad[]> {
    return new Promise<Ad[]>(
      async (rs, rj) => {
        const ads: Ad[] = [];
        try {
          this.config = await this.http.get<AdsConfig>('assets/ads/ads-config.json').toPromise();
        } catch (error) {
          rj('Could not get ads config');
        }
        if (this.config.ads && this.config.ads.length > 0) {
          for (const ad of this.config.ads) {
            if (ad.name && ad.startDate && ad.endDate) {
              try {
                const adHTML = await this.http.get<string>(
                  `assets/ads/${ad.name}.html`,
                  // @ts-ignore 'text' is a valid responseType
                  {responseType: 'text'}
                ).toPromise();
                ads.push({
                  html: adHTML,
                  startDate: moment(ad.startDate).toISOString(),
                  endDate: moment(ad.endDate).toISOString()
                });
              } catch (error) {
                  rj(`HTML for ad '${ad.name}' could not be loaded. Error: <${JSON.stringify(error)}>`);
              }
            } else {
              rj('Ad element not properly formatted');
            }
          }
          rs(ads);
        }
        rj('No ads defined');
      }
    );
  }
}
