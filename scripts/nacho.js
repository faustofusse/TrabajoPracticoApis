
var periods = [];
var coordenates = "";

getWeather();
name2coordenates("Gualeguaychu");

function name2coordenates(nombre){
	let key = "3b7d64b2de6d485387433f66ad13ab15";
	let url = "https://api.opencagedata.com/geocode/v1/json?";
	let parameters = {
		q: "",
		key: key
	};
	$.get(url, parameters, function(data){
		coordenates = data;
	}, 'json');
}

function getWeather(){
	let id_weather = "U8ra8pqtZZ7bQFMdZNIxb";
	let secret_weather = "gzFYDYzyjYMxvF7LAjbBgZw5ztGMsgBr3V1LGiVv";
	let url_weather = "https://api.aerisapi.com/forecasts/-33.007778,-58.511111?";
	let parameters = {
		to:'+15days',
		filter: '24hr',
		client_id: id_weather,
		client_secret: secret_weather
	};
	$.get(url_weather, parameters, function (data) {
		periods = data.response[0].periods;
		$('p').html(JSON.stringify(periods));
	}, 'json');
}