import {Component, Input, OnInit} from '@angular/core';
import {BasicPageComponent} from '../../components/basic-page/basic-page.component';
import {AdsService} from '../../services/ads/ads.service';
import {Ad} from '../../../types/Ads';
import {BreakpointObserver} from '@angular/cdk/layout';

/**
 *
 */
@Component({
  selector: 'app-ads-page',
  templateUrl: './ads-page.component.html',
  styleUrls: ['./ads-page.component.scss'],
  providers: [BreakpointObserver]
})
export class AdsPageComponent extends BasicPageComponent implements OnInit {
   @Input() landscape;

  ads: Ad[] = [];
  currentAdIndex = 0;

  constructor(private adsService: AdsService,
              private breakpointObserver: BreakpointObserver) { super('ads'); }

  async ngOnInit() {
    this.adsService.getAds()
      .then(ads => this.ads = ads)
      .catch(error => this.error(error));
  }

  onSelected() {
    this.currentAdIndex >= (this.ads.length - 1)
      ? this.currentAdIndex = 0
      : this.currentAdIndex += 1;
  }

}
