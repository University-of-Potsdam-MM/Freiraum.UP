import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {BasicPageComponent} from '../../components/basic-page/basic-page.component';
import {TranslateService} from '@ngx-translate/core';
import * as L from 'leaflet';
import 'leaflet-easybutton';
import 'leaflet-rotatedmarker';
import 'leaflet-search';
import {Campus} from '../../../types/Config';
import {PopupEvent} from 'leaflet';
import {CampusMapDataResponse, IMapsResponseObject} from '../../../types/campusMapData.response';

/**
 * @desc loads map and initializes it
 */
function initializeLeafletMap() {
  // create map object
  const map = L.map('map').fitWorld();
  L.tileLayer(
    'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'www.uni-potsdam.de',
      maxZoom: 18
    }).addTo(map);
  return map;
}

@Component({
  selector: 'app-campus-map-page',
  templateUrl: './campus-map-page.component.html',
  styleUrls: ['./campus-map-page.component.scss'],
})
export class CampusMapPageComponent extends BasicPageComponent implements OnInit {

  map: L.Map;
  overlays: {[name: string]: L.LayerGroup};
  control: L.Control.Layers;

  selectedCampus: Campus;
  featuresAtCampus = {};

  constructor(private translate: TranslateService) { super('campusMap'); }

  clicked(e) { console.log(e); }

  ngOnInit() {
    if (!this.map) {
      this.map = initializeLeafletMap();
      this.log(this.map)

      this.loadMapData(this.map);

      // // add marker for position
      // // TODO: add custom icon: https://leafletjs.com/examples/custom-icons/
      // L.marker(
      //   this.config.general.location.coordinates,
      //   {}
      // ).bindPopup(
      //   this.translate.instant('page.campus-map.you_are_here')
      // ).addTo(this.map);
    }

    this.map.invalidateSize(true);

    // select default campus first as specified in config
    this.selectedCampus = this.getDefaultCampus();

    // fit bounds to default campus
    this.moveToCampus(this.selectedCampus);
  }

  /**
   * @desc Returns the default campus object based on the information
   * provided in config.general.location
   * @return {ICampus} default campus object
   */
  getDefaultCampus(): Campus {
    return this.config.campusMap.campi.find(
      (campus: Campus) => {
        return campus.name === this.config.general.location.campus_name_short;
      }
    );
  }

  /**
   * @name loadMapData
   * @description loads campus map data from cache
   */
  loadMapData(map) {
    this.api.feeds.campusMapData.subscribe(
      (response: CampusMapDataResponse) => {
        console.log(response)
        // create control if not already done
        if (!this.control) {
          this.control = L.control.layers();
        }

        // remove existing overlays from map and control
        if (this.overlays) {
          for (const overlayName in this.overlays) {
            this.control.removeLayer(this.overlays[overlayName]);
            this.map.removeLayer(this.overlays[overlayName]);
          }
        }

        // create new overlays
        this.overlays = this.createOverlays(response);

        // add new overlays
        for (const overlayName in this.overlays) {
          this.control.addOverlay(this.overlays[overlayName], overlayName);
          this.overlays[overlayName].addTo(map);
        }
      }
    );
  }

  /**
   * @name moveToCampus
   * @description fits map to given campus
   * @param {ICampus} campus
   */
  moveToCampus(campus: Campus) {
    this.map.fitBounds(
      campus.lat_long_bounds
    );
  }

  toggleExpandItem(item) {
    item.expanded = !item.expanded;
  }

  collapseAll() {
    for (const campus in this.featuresAtCampus) {
      for (const item of this.featuresAtCampus[campus]) {
        item.expanded = false;
      }
    }
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
      const category = this.translate.instant(
        'page.campus-map.category.' + obj.category
      );

      // check if we already have this category in our overlays
      if (categories.indexOf(obj.category) === -1) {
        // Create new LayerGroup for each unique category
        overlays[category] = L.layerGroup();
        // Push category name so we know we already got that one
        categories.push(obj.category);
      }


      // add features from each category to corresponding layer
      for (const feature of obj.geo.features) {
        const props = feature['properties'];

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
