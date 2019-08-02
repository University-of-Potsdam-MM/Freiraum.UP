/**
 */
export interface IPageConfig {
  component:any;
  name:string;
  icon?:string;
  inputs?:{[name:string]:any};
  instance?:any;
  hide?:boolean;
  initParams?:any;
}
