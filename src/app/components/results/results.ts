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

  @Input('options') set options(options) {
    this._options = options || {};
  }

  _items = [];
  _options = {};

  @Input() template: TemplateRef<any>;
  @Input() error = false;
  @Input() errorHint = 'hint.noResultsError';
  @Input() errorIcon = 'warning';
  @Input() noResultsHint = 'hint.noResultsFound';
  @Input() noResultsIcon = 'information-circle-outline';
  @Input() customHint = undefined;
  @Input() showHintIfNoItems = true;
  @Input() showHintIfError = false;

  constructor() {}

}
