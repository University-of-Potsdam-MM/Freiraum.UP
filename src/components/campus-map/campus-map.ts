import {AfterViewInit, Component} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as L from 'leaflet';
import 'leaflet-easybutton';
import 'leaflet-rotatedmarker';
import 'leaflet-search';
import {IAppConfig, ICampus} from "../../interfaces/IAppConfig";
import {ConfigProvider} from "../../providers/config/config";
import {Events} from "ionic-angular";
import {IMapsResponse} from "../../interfaces/IGeoJSON";
import {PopupEvent} from "leaflet";

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
  selector: 'campus-map',
  templateUrl: 'campus-map.html',
})
export class CampusMapComponent implements AfterViewInit {

  config:IAppConfig = ConfigProvider.config;
  map: L.Map;
  overlays: {[name: string]: L.LayerGroup};
  control:L.Control.Layers;

  selectedCampus: ICampus;
  featuresAtCampus = {};

  constructor(
    private events: Events,
    private translate: TranslateService
  ) {}

  clicked(e){console.log(e)}

  ngAfterViewInit(){
    if(!this.map) {
      this.map = initializeLeafletMap();

      this.loadMapData(this.map);

      // add marker for position
      // TODO: add custom icon: https://leafletjs.com/examples/custom-icons/
      L.marker(
        ConfigProvider.config.general.location.coordinates,
        {}
      ).bindPopup(
        this.translate.instant("page.campus-map.you_are_here")
      ).addTo(this.map);
    }

    this.map.invalidateSize(true);

    // select default campus first as specified in config
    this.selectedCampus = this.getDefaultCampus();

    // fit bounds to default campus
    this.moveToCampus(this.selectedCampus);

    this.map.on('popupopen', (popup:PopupEvent) => {
      this.events.publish("userInput:popupOpened", {content: popup.popup['_content']});
    });

    this.map.on('moveend', (move) => {
      this.events.publish("userInput:movedMap", {});
    });

    this.map.on('zoomend', (zoom) => {
      this.events.publish("userInput:zoomedMap", {});
    });

    this.map.on('click', (click: MouseEvent) => {
      this.events.publish("userInput:clickedMap", click['containerPoint']);
    });

    this.events.subscribe(
      "reset",
      ()=>{
        this.selectedCampus = this.getDefaultCampus();
        this.moveToCampus(this.selectedCampus);
        this.collapseAll()
      }
    );
  }

  /**
   * @desc Returns the default campus object based on the information
   * provided in config.general.location
   * @return {ICampus} default campus object
   */
  getDefaultCampus():ICampus{
    return this.config.campusmap.campi.find(
      (campus:ICampus) => {
        return campus.name === this.config.general.location.campus_name_short;
      }
    );
  }

  /**
   * @name loadMapData
   * @description loads campus map data from cache
   */
  loadMapData(map) {
    this.events.subscribe(
      "webservice:maps",
      (response: IMapsResponse)=>{
        // create control if not already done
        if(!this.control) {
          this.control = L.control.layers();
        }

        // remove existing overlays from map and control
        if(this.overlays) {
          for(const overlayName in this.overlays){
            this.control.removeLayer(this.overlays[overlayName]);
            this.map.removeLayer(this.overlays[overlayName]);
          }
        }

        // create new overlays
        this.overlays = this.createOverlays(response);

        // add new overlays
        for(const overlayName in this.overlays){
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
  moveToCampus(campus: ICampus) {
    this.map.fitBounds(
      campus.lat_long_bounds
    );
  }

  toggleExpandItem(item){
    item.expanded = !item.expanded;
    if(item.expanded) {
      this.events.publish("userInput:clickedButton",
      {name: item.feature.properties.title }+":item")
    }
  }

  collapseAll() {
    for(let campus in this.featuresAtCampus) {
      for(let item of this.featuresAtCampus[campus]) {
        item.expanded = false;
      }
    }
  }

  createOverlays(geoJSON: IMapsResponse) {
    // just used to remember which categories we've seen already
    const categories: string[] = [];

    // this object will be populated next and then added to the map
    const overlays = {};

    // create a mapping of campusName to ICampus object
    const campusMapping = {};
    for (const c of this.config.campusmap.campi) {
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
        props['campus'] = campusMapping[obj.campus];
        props['category'] = category;
        if(props.description){
          props.description = props.description.replace(/\n/g, '<br>');
        }

        const geoJson = L.geoJSON(feature);
        const title = `${props.Name} (${props.campus.pretty_name})`;
        props['title'] = title;
        const popupTemplate = `<h1>${title}</h1><div>${props.description ? props.description : ''}</div>`;

        geoJson.bindPopup(popupTemplate);

        geoJson.on("click", ()=>{
          if (props.campus.name !== this.selectedCampus.name) {
            this.selectedCampus = props.campus;
          }
        });

        // add this feature to the corresponding overlay catgory
        overlays[category].addLayer(geoJson);

        this.featuresAtCampus[props.campus.name].push({
          geoJson: geoJson,
          feature: feature,
          expanded: false
        });
      }
    }

    for(let featureListName in this.featuresAtCampus){
      this.featuresAtCampus[featureListName].sort((a, b)=>{
        return ('' + a.feature.properties.Name).localeCompare(b.feature.properties.Name);
      });
    }

    return overlays;
  }
}
