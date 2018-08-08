var cnn = {id:"cnn",baseColor:"",colorHover:""},
    dailyMail = {id:"daily-mail",baseColor:"",colorHover:""},
    espn = {id:"espn",baseColor:"",colorHover:""},
    marca = {id:"marca",baseColor:"",colorHover:""},
    theNewYorkTimes = {id:"the-new-york-times",baseColor:"#263238",colorHover:"#1565c0"},
    foxSports = {id:"fox-sports",baseColor:"",colorHover:""};

var botonActivo = botones[2];
var noticia = $('div.noticia');
var key = "d1eae06defad4bb29383968c90e85a4b";
var parameters = {
	"apiKey": key,
	"sources": botonActivo.id,
	//"from":"2015-08-07",
	//"sortBy":"popularity"
};

$('button#'+botonActivo.id).css('background-color', botonActivo.colorHover);

$('header nav div.diarios button').click(function() {
	botonActivo = 
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
		
		for (var i = 0; i < data.articles.length; i++) {
			alert(JSON.stringify(data.articles[i]));
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
actualizarContenido();

function findButtonById(id){
	for (var b in botones){
		if (id == b.id){
			return b;
		}
	}
	return null;
}