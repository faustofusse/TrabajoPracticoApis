var diarios = [{id:"cnn",baseColor:"",colorHover:""},
    	{id:"daily-mail",baseColor:"",colorHover:""},
    	{id:"bbc-news",baseColor:"",colorHover:""},
    	{id:"marca",baseColor:"",colorHover:""},
    	{id:"the-new-york-times",baseColor:"#263238",colorHover:"#1565c0"},
    	{id:"fox-sports",baseColor:"",colorHover:""}];

var date = new Date();
var day = date.getDate(); var daysPast = 0;
var month = date.getMonth()+1; var monthsPast = 0;
var year = date.getFullYear(); var yearsPast = 0;-----------------------

var diarioActivo = diarios[0];
var idioma = "en";
var noticia = $('div.noticia');
var key = "d1eae06defad4bb29383968c90e85a4b";
var parameters = {
	"apiKey": key,
	"sources": diarioActivo.id,
	"language": idioma,
	"to": getYear()+getMonth()+getDay(),
	//"sortBy":"popularity",
	//"q":"bitcoin",
};

actualizarContenido();
	
//$('button#'+diarioActivo.id).css('background-color', botonActivo.colorHover);
	
$('header nav div.diarios button').click(function() {
	parameters.sources = $(this).attr('id');
	actualizarContenido();
}); 
	
function actualizarContenido () {
	$('div.noticia').remove();
	$.ajax({
		//url: 'https://newsapi.org/v2/sources?' + key,
		//url: 'https://newsapi.org/v2/top-headlines?' + $.param(parameters),
		url: 'https://newsapi.org/v2/everything?' + $.param(parameters),
		type: 'GET',
		dataType: 'json',
	})
	.done(function(data) {
		console.log(JSON.stringify(data));
		for (var i = 0; i < data.articles.length; i++) {
			//alert(JSON.stringify(data.articles[i]));
			var clon = noticia.clone();
			var fuente = data.articles[i].source.name + " - " + data.articles[i].publishedAt;
			var link = data.articles[i].url;
			clon.find('h2').html(data.articles[i].title);
			clon.find('h3').html(data.articles[i].description);
			clon.find('img').attr('src',data.articles[i].urlToImage);
			clon.find('span').html(fuente);
			clon.click(function (){alert(link);});
			clon.appendTo('main'); 
		}
	})
	.fail(function() {
		alert("Error obtaining JSON");
	});
}


function findButtonById(id){
	for (var b in botones){
		if (id == b.id){
			return b;
		}
	}
	return null;
}

function getDay(){
	if (day - daysPast <10){
		return "0" + (day - daysPast);
	}else{
		return "" + (day - daysPast);
	}
}
function getMonth(){
	if (month - monthsPast <10){
		return "0" + (month-monthsPast);
	}else{
		return "" + (month-monthsPast);
	}
}
function getYear(){
	return "" + (year-yearsPast);
}