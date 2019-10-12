const map = L.map('map').setView([42.484390, -71.191670], 15);

const baseLayer = L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=D8jbzWhuxqVcogN8aSZg', {
    attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">© MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap contributors</a>',
}).addTo(map);

fetch('/heatmapdata.json').then(res => {
	const json = res.json().then(data => {
		console.log(data);
		const heat = L.heatLayer(data, {minOpacity: 0.1, maxZoom: 12, radius: 75, max: 1, gradient: {0: '#ff00ff', 0.25: '#0000ff', 0.5: '#00ff00', 0.75: '#ffff00', 1: '#ff0000'}}).addTo(map);
	});
});

const legend = L.control({ position: "bottomright" });

legend.onAdd = function(map) {
  const div = L.DomUtil.create("div", "legend");
  div.innerHTML += "<h4>Mosquito Chance</h4>";
  div.innerHTML += '<i style="background: #ff00ff"></i><span>Minimal Chance</span><br>';
  div.innerHTML += '<i style="background: #0000ff"></i><span>Very Unlikely</span><br>';
  div.innerHTML += '<i style="background: #00ff00"></i><span>Unlikely</span><br>';
  div.innerHTML += '<i style="background: #ffff00"></i><span>Likely</span><br>';
  div.innerHTML += '<i style="background: #ff0000"></i><span>Very Likely</span><br>';

  return div;
};

legend.addTo(map);
