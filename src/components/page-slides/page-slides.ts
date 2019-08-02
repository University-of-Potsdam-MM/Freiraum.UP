import { Component } from '@angular/core';

/**
 * Generated class for the PageSlidesComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'page-slides',
  templateUrl: 'page-slides.html'
})
export class PageSlidesComponent {

  text: string;

  constructor() {
    console.log('Hello PageSlidesComponent Component');
    this.text = 'Hello World';
  }

}
