var map = L.map('map').setView([42.484390, -71.191670], 15);

var baseLayer = L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=D8jbzWhuxqVcogN8aSZg', {
    attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">© MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap contributors</a>',
}).addTo(map);
var heat = L.heatLayer([
[42.484390, -71.191670, 10], // lat, lng, intensity
], {radius: 25}).addTo(map);
