import {Component, Input, OnInit} from '@angular/core';
import {BasicPageComponent} from '../../components/basic-page/basic-page.component';

@Component({
  selector: 'app-campus-map-page',
  templateUrl: './campus-map-page.component.html',
  styleUrls: ['./campus-map-page.component.scss'],
})
export class CampusMapPageComponent extends BasicPageComponent implements OnInit {

  @Input() data: any;
  constructor() { super('campusMap'); }

  ngOnInit() {}

}
