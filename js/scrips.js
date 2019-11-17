// Creación de mapa
var map = L.map("mapid");

// Coord centrales de despliege y nivel de zoom
var center = L.latLng([12.5, -85.0]);
var zoomLevel = 6;

// Despliege de vista con los paramentros establecidos
map.setView(center, zoomLevel);

// Añadir escala gráfica
L.control.scale({imperial:false}).addTo(map);

// Añadir mapas base a variables
osmLayer = L.tileLayer.provider("OpenStreetMap.Mapnik").addTo(map);
terrain = L.tileLayer.provider("Stamen.Terrain").addTo(map);

// Añadir capa ráster 
var precipitationLayer = L.imageOverlay("mean_pre_ac.png", 
	[[18.5000000000000000, -92.2249999999999943], 
	[7.1999999999999993, -77.1749999999999972]], 
	{opacity:0.5}
).addTo(map);

// Función de opacidad de capa ráster
function updateOpacity() {
	document.getElementById("span-opacity").innerHTML = document.getElementById("sld-opacity").value;
	precipitationLayer.setOpacity(document.getElementById("sld-opacity").value);
}

// Paleta de colores capa GEOJSON
function getColor(d) {
    return d > 1000 ? '#800026' :
           d > 500  ? '#BD0026' :
           d > 200  ? '#E31A1C' :
           d > 100  ? '#FC4E2A' :
           d > 50   ? '#FD8D3C' :
           d > 20   ? '#FEB24C' :
           d > 10   ? '#FED976' :
                      '#FFEDA0';
}

// LLamamdo y estilo de capa GEOJSON
$.getJSON("cafe_simp.geojson", function(geodata) {
	var layer_geojson_cafe = L.geoJson(geodata, {
		style: function(feature) {
			return {
				fillColor: getColor(feature.properties.cafe_mean),
				weight: 1,
				opacity: 1,
				color: '#7f8c8d',
				fillOpacity: 0.5
				}
		},
		onEachFeature: function(feature, layer) {
			var popupText = "Municipio: " + feature.properties.NAME_2 + "<br>" 
			+ "Hectáreas de café: " + feature.properties.cafe_mean;
			layer.bindPopup(popupText);
		}			
	}).addTo(map);
	control_layers.addOverlay(layer_geojson_cafe, 'Producción de café');
	layer_geojson_cafe.remove();
});

$.getJSON("banano_simp.geojson", function(geodata) {
	var layer_geojson_banano = L.geoJson(geodata, {
		style: function(feature) {
			return {
				fillColor: getColor(feature.properties.banano_mean),
				weight: 1,
				opacity: 1,
				color: '#7f8c8d',
				fillOpacity: 0.5
				}
		},
		onEachFeature: function(feature, layer) {
			var popupText = "Municipio: " + feature.properties.NAME_2 + "<br>" 
			+ "Hectáreas de banano: " + feature.properties.banano_mean;
			layer.bindPopup(popupText);
		}			
	}).addTo(map);
	control_layers.addOverlay(layer_geojson_banano, 'Producción de banano');
	layer_geojson_banano.remove();
});

// Variable con mapas base y capas vectoriales
var baseMaps = {
	"TerrainStamen": terrain,
	"OpenStreetMap": osmLayer,
	
};

var overlayMaps = {
	"Precipitación": precipitationLayer
};

// Aladir control de capas
control_layers = L.control.layers(baseMaps, overlayMaps, {"autoZIndex": true,
	"collapsed": false, "position": "topright"}).addTo(map);
	
// No desplegar capa restar de inicio
precipitationLayer.remove();
