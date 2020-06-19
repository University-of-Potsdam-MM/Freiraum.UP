import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Ad, AdsConfig} from '../../../types/Ads';
import * as moment from 'moment';
import {NGXLogger} from 'ngx-logger';
import {Observable, Observer, ReplaySubject, timer} from 'rxjs';
import {ConfigService} from '../config/config.service';

function isAd(ad: any): ad is Ad {
  return ad.name && ad.startDate && ad.endDate && ad.file;
}

@Injectable({
  providedIn: 'root'
})
export class AdsService {

  private config = ConfigService.config;

  constructor(private http: HttpClient,
              private logger: NGXLogger) { }

  /**
   * filter ads and keep only the ones that should currently be shown
   * @param ads: ads to be filtered
   */
  private filterAds(ads: Ad[]) {
    return ads.filter(ad => moment().isBetween(ad.startDate, ad.endDate));
  }

  /**
   * reads ads from the given adsConfig object. Tries to retrieve ads from the defined URL and
   * saves them as HTML-string. Then returns the list of ads.
   * @param adsConfig: Definition of ads to retrieve
   */
  private async readAds(adsConfig: AdsConfig) {
    const ads: Ad[] = [];
    if (adsConfig.length === 0) {
      this.logger.error('No ads defined');
    } else {
      for (const ad of adsConfig) {
        if (!isAd(ad)) {
          this.logger.info('Ad element not properly formatted');
          continue;
        }

        try {
          const adHTML = await this.http.get<string>(
            this.config.ads.url + ad.file,
            // @ts-ignore 'text' is a valid responseType
            {responseType: 'text'}
          ).toPromise();
          ads.push({
            html: adHTML,
            name: ad.name,
            startDate: moment(ad.startDate).toISOString(),
            endDate: moment(ad.endDate).toISOString()
          });
        } catch (error) {
          this.logger.info(`HTML for ad '${ad.name}' could not be loaded.`);
        }
      }
    }
    return ads;
  }

  /**
   * retrieves adsConfig from URL and reads available ads. Then returns found ads by using the
   * observers 'next' method.
   * @param observer: the observer the ads should be given to
   */
  private async getAds(observer: Observer<Ad[]>) {
    let ads: Ad[] = [];
    let adsConfig: AdsConfig = null;

    try {
      let url;
      // if (this.config.ads.config_file_url) {
      url = this.config.ads.url + this.config.ads.adsConfig;
      // }
      // else {
      //   // if url is not given in the config we try to deduce it
      //   url = `${this.config.general.location.campus_name_short}-haus-${this.config.general.location.building}`;
      // }
      adsConfig = await this.http.get<AdsConfig>(url).toPromise();
    } catch (error) {
      this.logger.error('Could not get ads config');
    }

    if (adsConfig) {
      ads = await this.readAds(adsConfig);
    }

    observer.next(this.filterAds(ads));
  }

  /**
   * returns an observable that will emit a list of ads in a regular interval defined by
   * the value of 'config.ads.update_frequency'. If no ads could be found or an error occurs
   * the observable will just return an empty list.
   */
  public ads(): Observable<Ad[]> {
    return new Observable<Ad[]>(
      observer => {
        timer(0, this.config.ads.update_frequency * 1000).subscribe(
          _ => this.getAds(observer)
        );
      }
    );
  }
}
