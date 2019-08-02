import {Component, Input, TemplateRef} from '@angular/core';

/**
 * Component for displaying a list of results in a given template. If list of
 * results is empty a hint will be displayed. If no template is given a default
 * template is used
 */
@Component({
  selector: 'results',
  templateUrl: 'results.html'
})
export class ResultsComponent {

  @Input('items') set items(items) {
    this._items = items || [];
  }

  _items = [];

  @Input() template:TemplateRef<any>;

  @Input() hints:{errorHint:string; noResultsHint:string} = {
    errorHint: "hint.noResultsError",
    noResultsHint: "hint.noResultsFound"
  };

  constructor() {}

}
