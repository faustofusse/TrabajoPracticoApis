var keyIpStack = "01b795cb905222891a979bd96c96799c";
var ip = "181.30.51.38";
var traduccion = "";

$('#submitYoda').click(function() {
	$('span#traduccion').html(getYoda($('input#yoda').val()));
});

function getLocationJSON(key, ip) {
	$.ajax({
		method:'GET',
		//url:'http://api.openweathermap.org/data/2.5/weather?lat=35&lon=139',
		url: 'http://api.ipstack.com/'+ip+'?access_key='+keyIpStack,
		dataType:'json',
		success:function onSuccess (jsonReturn){
			$('p').html(JSON.stringify(jsonReturn));
		},
		error:function onError (){
			alert('Error obteniendo JSON');
		}
	})
}
//getLocationJSON(keyIpStack, ip);
	
function getYoda(text){
	var params = {"text":text,};
	
	$.ajax({
		url: 'http://api.funtranslations.com/translate/yoda.json?'+ $.param(params),
		type: 'GET',
		dataType: 'json',
	})
	.done(function(data) {
		$('span').html(data.contents.translated);
		traduccion = "gomes";
	})
	.fail(function() {
		alert("Error obteniendo json de yoda");
	});

	return "Traduccion: " + traduccion;
}
