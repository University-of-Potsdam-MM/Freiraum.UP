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

  filterAds(ads: Ad[]) {
    return ads.filter(
      ad => moment().isBetween(ad.startDate, ad.endDate)
    );
  }

  getAds(): Promise<Ad[]> {
    return new Promise<Ad[]>(
      async (rs, rj) => {
        const ads: Ad[] = [];
        try {
          this.config = await this.http.get<AdsConfig>('assets/ads/ads-config.json').toPromise();
        } catch (error) {
          rj('Could not get ads config');
          return;
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
                  console.log(`HTML for ad '${ad.name}' could not be loaded.`);
              }
            } else {
              console.log('Ad element not properly formatted');
            }
          }
          rs(this.filterAds(ads));
          return;
        }
        rj('No ads defined');
        return;
      }
    );
  }
}
