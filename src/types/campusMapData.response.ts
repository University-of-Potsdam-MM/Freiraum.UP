import {GeoJsonObject} from 'geojson';
import {Campus} from "./Config";

export interface ICrsProperties {
  name: string;
}

export interface ICrs {
  properties: ICrsProperties;
  type: string;
}

export interface IProperties {
  extrude: number;
  timestamp: string;
  Name: string;
  icon: string;
  visibility: number;
  description: string;
  tessellate: number;
  drawOrder: string;
  end: string;
  altitudeMode: string;
  begin: string;

  campus: Campus;
  category: string;
  title: string;
}

export interface IGeometry {
  type: string;
  coordinates: any[];
}

export interface IFeature {
  properties: IProperties;
  type: string;
  geometry: IGeometry;
}

export interface IGeo {
  crs: ICrs;
  features: (IFeature & GeoJsonObject)[];
  type: string;
}

export interface IMapsResponseObject {
  campus: string;
  category: string;
  geo: IGeo;
}

export type CampusMapDataResponse = IMapsResponseObject[];
