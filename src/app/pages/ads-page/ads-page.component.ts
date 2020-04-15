import { Component, OnInit } from '@angular/core';
import {BasicPageComponent} from '../../components/basic-page/basic-page.component';

@Component({
  selector: 'app-ads-page',
  templateUrl: './ads-page.component.html',
  styleUrls: ['./ads-page.component.scss'],
})
export class AdsPageComponent extends BasicPageComponent implements OnInit {

  constructor() { super('ads'); }

  ngOnInit() {}

}
