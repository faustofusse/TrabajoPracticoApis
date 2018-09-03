let base_url = "https://api.darksky.net/forecast/be53c11d1d3f54a342807d26b5e78b95/37.8267,-122.4233";
$.get(base_url, function(data) {
	console.log(JSON.stringify(data));
});