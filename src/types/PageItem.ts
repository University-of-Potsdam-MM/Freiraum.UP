import {Type} from '@angular/core';

export interface PageItem {
    component: Type<any>;
    name: string;
    icon: string;
    selected?: boolean;
    inputs?: {[key: string]: any};
    interactiveModes: boolean[];
    customTitle?: string;
}
