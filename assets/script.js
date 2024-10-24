// Wait for the window to load before running the script
window.onload = function() {
  // Mapbox access token
  mapboxgl.accessToken = 'pk.eyJ1IjoibWJhYXJzIiwiYSI6ImNtMTM0c2cwdTE5dHQya3EyZTFiZXFwMTYifQ.cX8VRWBnwyX0Euv9oqoCTw';

  // Initialize the map
  const map = new mapboxgl.Map({
    container: 'map',  // ID of the map container in your HTML
    style: 'mapbox://styles/mbaars/cm2dq7l4r00k201pscnoic3xf',  // Mapbox style
    center: [-104.88799, 39.78023],  // Set initial map center (longitude, latitude)
    zoom: 13, // Set initial zoom level
    attributionControl: true
  });

  map.on('load', function() {

    console.log("Load OpenStreetMap Basemap");

    map.addLayer({
      'id': 'OpenStreetMap Basemap',
      'type': 'raster',
      'source': {
        'type': 'raster',
        'tiles': [
          'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
      ],
      'tileSize': 256
      }
    }, 'denver-food-stores');

    // Add navigation controls
    var navControl = new mapboxgl.NavigationControl();
    map.addControl(navControl, 'top-right');

    // Define targets for the legend
    const targets = {
      'denver-food-stores': 'Food Stores',
      'denver-buildings-poly': 'Residential Buildings',
      'denver-boundary': 'City and County of Denver Boundary'
    };

    // Create the legend control
    const legend = new MapboxLegendControl(targets, {
      showDefault: true,  // Show the legend by default
      onlyRendered: true, // Show only rendered layers
      showCheckbox: true, // Disable checkboxes for toggling
    });

    // Optionally, append the legend to a custom container if needed
    document.querySelector('.ui-control-container').appendChild(legend.onAdd(map));
  });

  const layerNamesToIds = {
    DenverFoodStores: 'denver-food-stores',
    residentialBuildings: 'denver-buildings-poly',
    cityBoundary: 'denver-boundary'
  };
  
  map.on('idle', () => {
    const requiredLayers = Object.values(layerNamesToIds);
  
    for (const layerId of requiredLayers) {
        if (!map.getLayer(layerId)) {
            return;
        }
    }
  
    const toggleableLayerNames = Object.keys(layerNamesToIds);
  
    let menu = document.querySelector('.menu');
    if (!menu) {
        menu = document.createElement('div');
        menu.classList.add('menu');
    }
  
    for (const name of toggleableLayerNames) {
        if (document.getElementById(name)) {
            continue;
        }
  
        const link = document.createElement('a');
        link.id = name;
        link.href = '#';
        link.textContent = name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        link.className = 'active';
  
        link.onclick = function (e) {
            const clickedLayerName = this.id;
            const clickedLayerId = layerNamesToIds[clickedLayerName];
            e.preventDefault();
            e.stopPropagation();
  
            const visibility = map.getLayoutProperty(clickedLayerId, 'visibility');
  
            if (visibility === 'visible') {
                map.setLayoutProperty(clickedLayerId, 'visibility', 'none');
                this.className = '';
            } else {
                this.className = 'active';
                map.setLayoutProperty(clickedLayerId, 'visibility', 'visible');
            }
        };
  
        menu.appendChild(link);
    }
  
    const layersContainer = document.getElementById('layers');
    if (layersContainer) {
        layersContainer.appendChild(menu);
    }

    
  });
  
};




