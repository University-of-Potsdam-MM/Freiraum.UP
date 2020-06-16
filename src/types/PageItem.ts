import {Type} from '@angular/core';

export interface PageItem {
    // The component to be used for this page
    component: Type<any>;
    // The name of this page
    name: string;
    // ionic-icon for this page
    icon: string;
    // can be used to provide additional inputs to a page. The page must also define '@Input()' variables
    // so these inputs can be used
    inputs?: {[key: string]: any};
    // defines the values of 'config.general.interactive_mode' for which this page shall be available
    // [true] -> page only available if run in interactive mode
    // [false] -> page only available if run in non interactive mode
    // [true, false] -> page available in both modes
    interactiveModes: boolean[];
    // can be used to set a custom title for this page
    customTitle?: string;
    // not to be set directly. Will be set by the application
    selected?: boolean;
}
