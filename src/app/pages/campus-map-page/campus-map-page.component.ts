import {Component} from '@angular/core';
import {BasicPageComponent} from '../../components/basic-page/basic-page.component';
import * as L from 'leaflet';
import 'leaflet-easybutton';
import 'leaflet-rotatedmarker';
import 'leaflet-search';
import {Campus} from '../../../types/Config';
import {CampusMapDataResponse} from '../../../types/campusMapData.response';

// this fix is necessary due to: https://github.com/Leaflet/Leaflet/issues/4968
// @ts-ignore
import icon from 'leaflet/dist/images/marker-icon.png';
// @ts-ignore
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});
L.Marker.prototype.options.icon = DefaultIcon;

@Component({
  selector: 'app-campus-map-page',
  templateUrl: './campus-map-page.component.html',
  styleUrls: ['./campus-map-page.component.scss'],
})
export class CampusMapPageComponent extends BasicPageComponent {

  map: L.Map;
  overlays: {[name: string]: L.LayerGroup};
  control: L.Control.Layers;

  selectedCampus: Campus;
  featuresAtCampus = {};
  fitBounds: any = null;

  options = {
    layers: [
      L.tileLayer(
        'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
            maxZoom: 18,
            // tslint:disable-next-line:max-line-length
            attribution: '© <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap-Mitwirkende</a> und www.uni-potsdam.de',
          }
        )
    ],
    zoom: 5
  };

  layersControl = {overlays: {}, baseLayers: {}};

  invalidate() {
    this.map.invalidateSize();
  }

  async onMapReady(map: L.Map) {
    this.map = map;
    setTimeout(() => { this.invalidate(); }, 1000);
    // select default campus first as specified in config
    this.selectedCampus = this.getDefaultCampus();
    this.fitBoundsToCampus(this.selectedCampus);

    this.api.feeds.campusMapData.subscribe(
      mapdata => {
        this.layersControl.overlays = this.createOverlays(mapdata);
      }
    );
  }

  constructor() { super('campusMap'); }

  /**
   * @desc Returns the default campus object based on the information
   * provided in config.general.location
   */
  getDefaultCampus(): Campus {
    return this.config.campusMap.campi.find(
      (campus: Campus) => {
        return campus.name === this.config.general.location.campus_name_short;
      }
    );
  }

  /**
   * fits bounds of map to given campus
   * @description fits map to given campus
   */
  fitBoundsToCampus(campus: Campus) {
    this.fitBounds = campus.lat_long_bounds;
  }

  createOverlays(geoJSON: CampusMapDataResponse) {
    // just used to remember which categories we've seen already
    const categories: string[] = [];

    // this object will be populated next and then added to the map
    const overlays = {};

    // create a mapping of campusName to ICampus object
    const campusMapping = {};
    for (const c of this.config.campusMap.campi) {
      campusMapping[c.name] = c;
      this.featuresAtCampus[c.name] = [];
    }

    for (const obj of geoJSON) {
      // create correct category string
      const category = this.translate.instant(`page.campusMap.category.${obj.category}`);

      // check if we already have this category in our overlays
      if (categories.indexOf(obj.category) === -1) {
        // Create new LayerGroup for each unique category
        overlays[category] = L.layerGroup();
        // Push category name so we know we already got that one
        categories.push(obj.category);
      }

      // add features from each category to corresponding layer
      for (const feature of obj.geo.features) {
        const props = feature.properties;

        // create new property that can easily be searched by leaflet-search
        props.campus = campusMapping[obj.campus];
        props.category = category;
        if (props.description) {
          props.description = props.description.replace(/\n/g, '<br>');
        }

        const geoJson = L.geoJSON(feature);
        const title = `${props.Name} (${props.campus.pretty_name})`;
        props.title = title;
        const popupTemplate = `<h1>${title}</h1><div>${props.description ? props.description : ''}</div>`;

        geoJson.bindPopup(popupTemplate);

        geoJson.on('click', () => {
          if (props.campus.name !== this.selectedCampus.name) {
            this.selectedCampus = props.campus;
          }
        });

        // add this feature to the corresponding overlay catgory
        overlays[category].addLayer(geoJson);

        this.featuresAtCampus[props.campus.name].push({
          geoJson,
          feature,
          expanded: false
        });
      }
    }

    for (const featureListName in this.featuresAtCampus) {
      this.featuresAtCampus[featureListName].sort((a, b) => {
        return ('' + a.feature.properties.Name).localeCompare(b.feature.properties.Name);
      });
    }

    return overlays;
  }
}
