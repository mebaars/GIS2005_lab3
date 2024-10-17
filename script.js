// Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoibWJhYXJzIiwiYSI6ImNtMTM0c2cwdTE5dHQya3EyZTFiZXFwMTYifQ.cX8VRWBnwyX0Euv9oqoCTw';

// Initialize the map
var map = new mapboxgl.Map({
  container: 'map',  // ID of the map container in your HTML
  style: 'mapbox://styles/mbaars/cm2dq7l4r00k201pscnoic3xf',  // Mapbox basemap style
  center: [-104.9903, 39.7392],  // Set initial map center (longitude, latitude)
  zoom: 9  // Set initial zoom level
});

// Function to load and add zipped shapefile as a GeoJSON layer
function loadShapefile(url, layerId, color) {
  fetch(url)
    .then(response => response.arrayBuffer())  // Fetch the ZIP file as an ArrayBuffer
    .then(buffer => shp(buffer))  // Use shp.js to convert the shapefile to GeoJSON
    .then(geojson => {
      // Add GeoJSON as a source
      map.addSource(layerId, {
        'type': 'geojson',
        'data': geojson
      });

      // Add layer to display the GeoJSON
      map.addLayer({
        'id': layerId,
        'type': 'fill',  // You can change this to 'line' or 'circle' depending on the data
        'source': layerId,
        'paint': {
          'fill-color': color,
          'fill-opacity': 0.5
        }
      });
    })
    .catch(error => console.error('Error loading shapefile:', error));
}

// Example usage: loading a shapefile from S3 or another location
map.on('load', function() {
  loadShapefile('https://mebaars.github.io/GIS2005_lab3/denver_buildings.zip', 'shapefileLayer1', '#ff0000');
  loadShapefile('https://mebaars.github.io/GIS2005_lab3/denver_food_stores.zip', 'shapefileLayer2', '#00ff00');
});

var navControl = new mapboxgl.NavigationControl();
document.querySelector('.mapbox-controls').appendChild(navControl.onAdd(map));