import mapboxgl from 'mapbox-gl';
import WindLayer from '@jindin/mapbox-gl-wind-layer';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN';

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/dark-v10',
  center: [-98, 38.88],
  zoom: 4
});

map.on('load', () => {
  // Add national boundary layer
  map.addSource('nationalBoundary', {
    type: 'vector',
    scheme: 'tms',
    tiles: ['http://172.18.1.178:8080/geoserver/gwc/service/tms/1.0.0/abdul_sattar:National_Boundary@EPSG:900913@pbf/{z}/{x}/{y}.pbf']
  });

  map.addLayer({
    id: 'nationalBoundary',
    type: 'line',
    source: 'nationalBoundary',
    'source-layer': 'National_Boundary',
    layout: {
      visibility: 'visible'
    },
    paint: {
      'line-opacity': 0.8,
      'line-color': 'white',
      'line-width': 3
    }
  });
  // Fetch wind data and add WindLayer
  fetch('gfs.json')
    .then(response => response.json())
    .then(data => {
      const windLayer = new WindLayer({
        id: 'wind-layer',
        name: 'Wind field layer',
        data: data, 
        windyOptions: {
          lineWidth: 1, 
          minVelocity: 0,
          maxVelocity: 8,
          particleAge: 90,
          particleMultiplier: 1 / 100,
          opacity: 0.97,
          colorScale: [
            "rgb(255,165,0)",  // Orange
            "rgb(255,215,0)",  // Gold
            "rgb(255,255,0)",  // Bright Yellow
            "rgb(255,255,51)", // Yellow
            "rgb(255,255,102)",// Light Yellow (even more intense)
            "rgb(255,255,178)",// Light Yellow (more intense)
            "rgb(255,255,224)",// Light Yellow
            "rgb(248,248,255)",// Ghost White
            "rgb(240,248,255)",// Alice Blue
            "rgb(173,216,230)",// Light Blue
            "rgb(135,206,250)",// Light Sky Blue
            "rgb(0,191,255)",  // Deep Sky Blue
            "rgb(0,204,255)",  // Lighter Blue
            "rgb(0,153,255)",  // Light Blue
            "rgb(0,102,255)"   // Lighter Dark Blue
          ],
          frameRate: 30, //less framerate is equal to more particle loaded per frame
          maxAge: 60,  //age of particles
          globalAlpha: 0.95, //particles because smalleer in size for less value default value was 0.9 it breaks closeup above 1
          velocityScale: 0.02, //Make particles go fast default value was 0.01
          paths: 7000
        }
      });

      // Add WindLayer to the map
      map.addLayer(windLayer);
    })
    .catch(error => {
      console.error('Error loading wind data:', error);
    });
});
