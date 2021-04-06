/** @format */

mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11",
  center: site.geometry.coordinates, //[lng,lat]
  zoom: 8,
});

new mapboxgl.Marker().setLngLat(site.geometry.coordinates).addTo(map);
