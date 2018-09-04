
/*----------------------- VARIABLES -----------------------*/

var key = "d1eae06defad4bb29383968c90e85a4b";
var newsApi = {
	url: "https://newsapi.org/v2/everything?" + "apiKey=" + key,
	parameters: {
		from: fecha,
		to: fecha,
		sources: "infobae",
	} // otros parametros pueden ser country, language, q (palabra clave)
};

var diarios = ['cnn', 'daily-mail', 'bbc-news', 'marca', 'the-new-york-times', 'fox-sports']
var diarioActivo;
var colorNormal = '#0d47a1';
var colorHover = '#1565c0';

var noticias = [];
var noticia = $('div.noticia');
var ultimaNoticia;

var fecha = ""; 
var date = new Date();
var day = date.getDate(); var daysPast = 0;
var month = date.getMonth()+1; var monthsPast = 0;
var year = date.getFullYear(); var yearsPast = 0;
var	fecha = getYear() + "-" + getMonth() + "-" + getDay();


/*----------------------- INICIALIZACION -----------------------*/

$('div.noticia').remove();
rellenarContenido();
var text = "Barcelona recibirá hoy al recién ascendido y debutante en Primera División, el SD Huesca, en la previa del parate de los torneos oficiales una doble fecha de selecciones dispuesta por la FIFA. La visita del equipo dirigido por el ex arquero argentino Leonardo Franco a los liderados en cancha por Lionel Messi será a las 13:30 (hora de la Argentina) supondrá una riesgosa empresa pero, se sabe, los partidos deben jugarse.";
//getRelatedEntities(text);

/*----------------------- EVENTOS -----------------------*/

$('header nav div.diarios button').click(function() {
	var id = $(this).attr('id');
	diarioActivo = findDiarioBySource(id);
	newsApi.parameters.sources = diarioActivo;
	$('div.noticia').remove();
	noticias = [];
	rellenarContenido();
});

$('#floatingButton').click(function() {
	$("html, body").animate({scrollTop: 0}, "slow");
});

$('input#buscarDiarios').click(function() {
	if($(this).val().length > 0){
		$('main div.busqueda').slideDown();
	}
});

$('input#buscarDiarios').focusout(function() {
	$('main .busqueda').slideUp();
});

$('input#buscarDiarios').keypress(function(event) {
	if (event.keyCode != 8)
		buscarDiarios($(this).val());
});

$('input#buscarDiarios').keyup(function(event) {
	// BACKSPACE KEYCODE = 8
	if (event.keyCode == 8 && $(this).val().length == 0){
		$('main div.busqueda').slideUp();
	}else if (event.keyCode == 8 && $(this).val().length > 0){
		buscarDiarios($(this).val());
	}
});

$(window).scroll(function() {
	if (ultimaNoticia.isInViewport()){
		ultimaNoticia.css('background-color', '#fff');
		ultimaNoticia = null;
		avanzarDia();
		rellenarContenido();
	}
	if ($('header nav').isInViewport()){
		$('#floatingButton').css('display', 'none');
	}else{
		$('#floatingButton').css('display', 'block');
	}
	$('main div.busqueda').slideUp(200);
});

/*----------------------- FUNCIONES -----------------------*/

function rellenarContenido(){
	newsApi.parameters.from = fecha;
	newsApi.parameters.to = fecha;
	$.get(newsApi.url, newsApi.parameters, function (data, status) {
		//console.log(data);
		for (var i = 0; i < data.articles.length; i++) {
			var clon = noticia.clone();
			var fuente = data.articles[i].source.name + " - " + data.articles[i].publishedAt;
			var link = data.articles[i].url;
			clon.find('h2').html(data.articles[i].title);
			clon.find('h3').html(data.articles[i].description);
			clon.find('img').attr('src',data.articles[i].urlToImage);
			clon.find('span#fecha').html(fuente);
			clon.click(clickNoticia);
			getRelatedEntities(data.articles[i].description, clon);
			clon.appendTo('main'); 
		}
		noticias = $.merge(noticias, data.articles);
		ultimaNoticia = $('div.noticia:last');
	}, 'json');
}

function buscarDiarios(busqueda){
	let sourcesUrl = "https://newsapi.org/v2/sources";
	$.get(sourcesUrl, {apiKey:key}, function(data){ // se le puede agregar el parametro lenguaje
		var sources = data.sources;
		var resultados = [];
		$('main div.busqueda button').remove();

		for(var i = 0; i< sources.length; i++){
			if (sources[i].name.toLowerCase().indexOf($.trim(busqueda.toLowerCase())) != -1){
				$('main .busqueda').slideDown();
				//$('main .busqueda').css('display', 'flex');
				resultados.push(sources[i]);
				var diario = '<button id="'+ sources[i].id +'"><i class="fa fa-newspaper"></i>' + sources[i].name + '</button>';
				$('main div.busqueda').append(diario);
				$('main div.busqueda button#'+sources[i].id).click(clickBotonBusqueda);
			}
		}
	}, 'json');
}

function getRelatedEntities(textos, noticias){

	// DANDELION API
	var url = 'https://api.dandelion.eu/datatxt/nex/v1/?';
	var parameters = {
		text: text,
		//token:'a8e24afa552d46339e8cf01c4403daa8',
		token: 'ad2dbaa1f90b4123a21105020eb455e4',
	};
	$.get(url, parameters, function(data){
		var entities = data.annotations;
		for (var i = entities.length - 1; i >= 0; i--) {
			if(entities[i].confidence > 0.8){
				var boton = '<a href="'+entities[i].uri+'">'+entities[i].label+'</a>';
				noticia.find('div.related').append(boton);
			}
		}
	}, 'json');
}

function clickBotonBusqueda(){
	var id = $(this).attr('id');
	//diarioActivo = findDiarioBySource(id);
	newsApi.parameters.sources = id;
	$('header nav input#buscarDiarios').val("");
	$('div.noticia').remove();
	noticias = [];
	rellenarContenido();
}

function clickNoticia(){
	var index = $('main div.noticia').index($(this));
	window.location.href = noticias[index].url;
}

function findDiarioBySource(source){
	for (var i = 0; i < diarios.length; i++) {
		if (source === diarios[i])
			return diarios[i];
	}
}

function avanzarDia(){
	daysPast++;
	if (monthsPast == 0 && yearsPast == 0){
		var diasParaCompletarMes = daysInMonth(month - monthsPast) - daysPast - day;
	}else{
		var diasParaCompletarMes = daysInMonth(month - monthsPast) - daysPast;
	}
	
	if (daysInMonth(month - monthsPast) - daysPast === 0){
		monthsPast++;
		daysPast = 0;
	}
	if (monthsPast == 12){
		yearsPast++;
		monthsPast = 0;
	}
	fecha = getYear()+"-"+getMonth()+"-"+getDay();
}

function daysInMonth(month) {
  var now = new Date();
  return new Date(now.getFullYear(), month, 0).getDate();
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

$.fn.isInViewport = function() {
	var elementTop = $(this).offset().top;
	var elementBottom = elementTop + $(this).outerHeight();
	var viewportTop = $(window).scrollTop();
	var viewportBottom = viewportTop + $(window).height();
	return elementBottom > viewportTop && elementTop < viewportBottom;
};