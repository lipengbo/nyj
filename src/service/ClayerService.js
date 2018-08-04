import mapService from '@/service/mapService';

class ClayerService {
  constructor(elm) {
    this.map = mapService.createMap({
      target: elm
    });
    this.layers = {
      'hnLayer': new ol.layer.Vector({
          source: new ol.source.Vector(),
          style: new ol.style.Style({
            stroke: new ol.style.Stroke({color: '#9C9C9C', width: 0.3}),
            fill: new ol.style.Fill({color: '#E1E1E1'})
          })
        }
      ),
      'oceanLayer': new ol.layer.Vector({
          source: new ol.source.Vector(),
          style: new ol.style.Style({
            /*         stroke: new ol.style.Stroke({color: '#9C9C9C', width: 0.2}),*/
            fill: new ol.style.Fill({color: '#8FCCF0'})
          })
        }
      ),
      'cityLayer': new ol.layer.Vector({
          source: new ol.source.Vector(),
          style: new ol.style.Style({
            stroke: new ol.style.Stroke({color: '#9C9C9C', width: 0.2}),
            /*          fill: new ol.style.Fill({color: '#E1E1E1'})*/
          })
        }
      ),
      "surferLayer": new ol.layer.Vector({
          source: new ol.source.Vector()
        }
      ),
      'stationLayer': new ol.layer.Vector({
          source: new ol.source.Vector()
        }
      ),
    };
    for(var k in this.layers){
      this.map.addLayer(this.layers[k])
    }
  }
  addFeatureById(id, geojson, text, x, y, layerStyle) {
    // var featureJson = '{"type": "Feature","geometry":' + geojson + '}';
    var format = new ol.format.GeoJSON();
    //添加图形
    if (id == 'hnLayer') {
      var hnLayer = this.layers.hnLayer;
      hnLayer.getSource().addFeatures(curFeatures);
    } else if (id == 'oceanLayer') {
      var oceanLayer = this.layers.oceanLayer;
      oceanLayer.getSource().addFeatures(curFeatures);
    } else if (id == 'cityLayer') {
      var cityLayer = this.layers.cityLayer;
      var curFeatures = format.readFeatures(geojson);
      //var geometry = curFeatures[0].getGeometry().transform('EPSG:4326', 'EPSG:3857');
      //curFeatures[0].setGeometry(geometry);
      cityLayer.getSource().addFeatures(curFeatures);
    } else if (id == 'surferLayer') {
      var surferLayer = this.layers.surferLayer;
      var curFeatures = format.readFeatures(geojson);
      var stroke = new ol.style.Stroke({color: '#9C9C9C', width: 0.2});
      var fill = new ol.style.Fill({color: '#FDE37D'});
      var surferStyle = new ol.style.Style({fill: fill});
      curFeatures.forEach(function (feature) {
        if (feature.getProperties().CONTOUR == 26) {
          feature.setStyle(surferStyle);
          surferLayer.getSource().addFeature(feature);
        } else if (feature.getProperties().CONTOUR == 28) {
          fill = new ol.style.Fill({color: '#FAA644'});
          surferStyle = new ol.style.Style({fill: fill});
          feature.setStyle(surferStyle);
          surferLayer.getSource().addFeature(feature);
        } else if (feature.getProperties().CONTOUR == 30) {
          fill = new ol.style.Fill({color: '#FF791A'});
          surferStyle = new ol.style.Style({fill: fill});
          feature.setStyle(surferStyle);
          surferLayer.getSource().addFeature(feature);
        }
      })
      //var geometry = curFeatures[0].getGeometry().transform('EPSG:4326', 'EPSG:3857');
      //curFeatures[0].setGeometry(geometry);
    } else if (id == 'stationLayer') {
      var stationLayer = this.layers.stationLayer;
      var pt = new ol.geom.Point([x, y]);
      var style = new ol.style.Style({
        image: new ol.style.Circle({
          radius: 3,
          stroke: new ol.style.Stroke({
            color: '#696969'
          }),
          fill: new ol.style.Fill({
            color: '#000000'
          })
        }),
        text: new ol.style.Text({
          text: text,
          offsetY: -15,
          offsetX: 15,
          fill: new ol.style.Fill({
            color: '#000000'
          })
        })
      });
      // pt = pt.transform('EPSG:4326', 'EPSG:3857');
      var featurePT = new ol.Feature({
        geometry: pt
      });
      featurePT.setStyle(style);
      //stationLayer.setStyle(style);
      stationLayer.getSource().addFeature(featurePT);
    }
  }

}

export default ClayerService
