import { Component, OnInit } from '@angular/core';
import {BasicPageComponent} from '../../components/basic-page/basic-page.component';
import {AdsService} from '../../services/ads/ads.service';
import {Ad} from '../../../types/Ads';

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

  constructor(private adsService: AdsService) { super('ads'); }

  async ngOnInit() {
    this.adsService.getAds()
      .then(ads => this.ads = ads)
      .catch(error => console.log(error));
  }

  onSelected() {
    this.currentAdIndex >= (this.ads.length - 1)
      ? this.currentAdIndex = 0
      : this.currentAdIndex += 1;
  }

}
