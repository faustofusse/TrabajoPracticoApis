getLocationJSON();


function getLocationJSON() {
	
	$.get('http://jsonip.com', function (res) {

        $('p').html('IP Address is: ' + res.ip);

    });

	var ip = "181.30.51.38";
	var key = "01b795cb905222891a979bd96c96799c";

	$.ajax({
		method:'GET',
		//url:'http://api.openweathermap.org/data/2.5/weather?lat=35&lon=139',
		url: 'http://api.ipstack.com/'+ip+'?access_key='+key,
		dataType:'json',
		success:onSuccess,
		error:onError
	})
	
	function onSuccess (jsonReturn){
		//alert(JSON.stringify(jsonReturn));
		var city = "";
		for (var i = jsonReturn.length - 1; i >= 0; i--) {
			city = jsonReturn[i].city;
		}
		$('p').html(city);
	}

	function onError (){
		alert('Error obteniendo JSON');
	}
	
}
