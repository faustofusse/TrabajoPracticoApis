navigator.geolocation.getCurrentPosition(function(position) {
  latitud =position.coords.latitude; 
  longitud = position.coords.longitude;
  //getNasaImage(latitud, longitud);
});

function getNasaImage(lat, lon){
	let url = 'https://api.nasa.gov/planetary/earth/imagery?';
	let key = 'vshuEUaQNIajeXsUGj7Sl4Kxy6xnxaNfITrAqqh1';
	var parameters = {
		lat: lat,
		lon: lon,
		api_key: key,
	};
	$.get(url, parameters, function(data){
		//$('p').html(JSON.stringify(data));
		$('main').prepend('<img src="'+data.url+'" />');
	}, 'json');
}