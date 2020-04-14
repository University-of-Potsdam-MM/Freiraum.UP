import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-campus-map-page',
  templateUrl: './campus-map-page.component.html',
  styleUrls: ['./campus-map-page.component.scss'],
})
export class CampusMapPageComponent implements OnInit {

  @Input() data: any;
  constructor() { }

  ngOnInit() {}

}
