import {Component, Input, OnInit} from '@angular/core';
import {EventItem} from '../../../types/events.response';

@Component({
  selector: 'event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss'],
})
export class EventComponent implements OnInit {

  @Input() event: EventItem;

  constructor() { }

  ngOnInit() {  }

}
