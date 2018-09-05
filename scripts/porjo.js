
getWeather('Boston', 15);

function getWeather(place, days){
	// NAME TO COORDENATES (MAPBOX API)
	let token = "pk.eyJ1IjoiZmF1c3RvZnVzc2UiLCJhIjoiY2psbm5oaXF4MWtxcDNwcGg3bHFmaDZwcCJ9.QU4FAWuFJlVUms6NTYj8QA";
	let url = "https://api.mapbox.com/geocoding/v5/mapbox.places/" + place + '.json?';
	let parameters = {
		access_token: token,
	};
	$.get(url, parameters, function(data){
		var longitud = data.features[0].geometry.coordinates[0];
		var latitud = data.features[0].geometry.coordinates[1];

		// GET WEATHER (AERIS API)
		let id_weather = 'U8ra8pqtZZ7bQFMdZNIxb';
		let secret_weather = 'gzFYDYzyjYMxvF7LAjbBgZw5ztGMsgBr3V1LGiVv';
		let url_weather = 'https://api.aerisapi.com/forecasts/'+ longitud +','+ latitud +'?';
		let parameters = {
			to:'+'+days+'days',
			filter: '24hr',
			client_id: id_weather,
			client_secret: secret_weather
		};
		$.get(url_weather, parameters, function (data) {
			var periods = data.response[0].periods;
			
		}, 'json');

	}, 'json');
}