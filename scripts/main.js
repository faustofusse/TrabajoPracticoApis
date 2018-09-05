
/*----------------------- VARIABLES -----------------------*/

var key = 'd1eae06defad4bb29383968c90e85a4b';
var mode = 'everything';
var newsApi = {
	url: 'https://newsapi.org/v2/'+ mode +'?' + 'apiKey=' + key,
	parameters: {
		from: fecha,
		to: fecha,
		sources: 'infobae',
		category: '',
	} // otros parametros pueden ser country, language, q (palabra clave)
};

var diarios = ['cnn', 'daily-mail', 'bbc-news', 'marca', 'the-new-york-times', 'fox-sports'],
    diarioActivo,
    colorNormal = '#0d47a1',
    colorHover = '#1565c0';

var noticias = [],
    noticia = $('div.noticia'),
    ultimaNoticia;

var fecha = "",
    date = new Date(),
    day = date.getDate(), daysPast = 0,
    month = date.getMonth()+1, monthsPast = 0,
    year = date.getFullYear(), yearsPast = 0,
   	fecha = getYear() + "-" + getMonth() + "-" + getDay();

var collapsed = true;

/*----------------------- INICIALIZACION -----------------------*/

diarioActivo = 'infobae';
$('div.noticia').remove();
$('button#everything i').css('display', 'block');
$('button#all i').css('display', 'block');
rellenarContenido();

/*----------------------- EVENTOS -----------------------*/

$('main, h1, input, button').click(function(event) {
	if(!collapsed){
		$('div.container div.sidebar').animate({width: '0%'});
		collapsed = true;
	}
});

$('button#menu').click(function(event) {
	$('div.container div.sidebar').animate({width: '60%'});
	collapsed = false;
});

$('header nav div.diarios button').click(function() {
	var id = $(this).attr('id');
	diarioActivo = findDiarioBySource(id);
	newsApi.parameters.sources = diarioActivo;
	$('div.noticia').remove();
	noticias = [];
	rellenarContenido();
});

$('ul#filter li button').click(function(event) {
	mode = $(this).attr('id');
	newsApi.parameters.category = '';
	newsApi.parameters.sources = diarioActivo;
	$('div.noticia').remove();
	noticias = [];
	rellenarContenido();
	$('ul button i').css('display', 'none');
	$(this).find('i').css('display', 'block');
	$('button#all i').css('display', 'block');
});

$('ul#categories li button').click(function(event) {
	mode = 'top-headlines';
	newsApi.parameters.category = $(this).attr('id');
	newsApi.parameters.sources = '';
	$('div.noticia').remove();
	noticias = [];
	rellenarContenido();
	$('ul button i').css('display', 'none');
	$('button#top-headlines i').css('display', 'block');
	$(this).find('i').css('display', 'block');
});

$('#floatingButton').click(function() {
	$("html, body").animate({scrollTop: 0}, "slow");
});

$('input#buscarDiarios').click(function() {
	if($(this).val().length > 0){
		$('div.busqueda').slideDown();
	}
});

$('input#buscarDiarios').focusout(function() {
	$('div.busqueda').slideUp();
});

$('input#buscarDiarios').keypress(function(event) {
	if (event.keyCode != 8)
		buscarDiarios($(this).val());
});

$('input#buscarDiarios').keyup(function(event) {
	// BACKSPACE KEYCODE = 8
	if (event.keyCode == 8 && $(this).val().length == 0){
		$('div.busqueda').slideUp();
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
	$('div.busqueda').slideUp(200);
});

/*----------------------- FUNCIONES -----------------------*/

function rellenarContenido(){
	newsApi.url = 'https://newsapi.org/v2/'+ mode +'?' + 'apiKey=' + key;
	newsApi.parameters.from = fecha;
	newsApi.parameters.to = fecha;
	$.get(newsApi.url, newsApi.parameters, function (data, status) {
		//console.log(data);
		var nuevasNoticias = [];
		for (var i = 0; i < data.articles.length; i++) {
			var clon = noticia.clone();
			var date = new Date(data.articles[i].publishedAt);
			var fuente = data.articles[i].source.name + " - " + date.toDateString();
			var link = data.articles[i].url;
			clon.find('h2').html(data.articles[i].title);
			clon.find('h3').html(data.articles[i].description);
			clon.find('img').attr('src',data.articles[i].urlToImage);
			clon.find('span#fecha').html(fuente);
			clon.click(clickNoticia);
			clon.appendTo('main'); 
			nuevasNoticias.push(clon);
		}
		addRelatedEntities(nuevasNoticias);
		noticias = $.merge(noticias, data.articles);
		ultimaNoticia = $('div.noticia:last');
	}, 'json');
}

function buscarDiarios(busqueda){
	let sourcesUrl = "https://newsapi.org/v2/sources";
	$.get(sourcesUrl, {apiKey:key}, function(data){ // se le puede agregar el parametro lenguaje
		var sources = data.sources;
		var resultados = [];
		$('div.busqueda button').remove();

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

function addRelatedEntities(noticias){
	var descripciones = [];
	var texto = '';
	for (var i = 0; i < noticias.length; i++) {
		var descripcion = noticias[i].find('h3').html();
		descripciones.push({
			start:texto.length,
			end:texto.length + descripcion.length,
			text: descripcion,
		});
		texto += descripcion;
	}

	// DANDELION API
	var url = 'https://api.dandelion.eu/datatxt/nex/v1/?';
	var parameters = {
		//token:'a8e24afa552d46339e8cf01c4403daa8',
		min_confidence: 0.75,
		token: 'ad2dbaa1f90b4123a21105020eb455e4',
		text: texto,
	};

	$.post(url, parameters, function(data){
		var entities = data.annotations;
		//console.log(data);
		for (var i = entities.length - 1; i >= 0; i--) {
			var noticia;
			for (var b = 0; b < descripciones.length; b++) {
				if (entities[i].start > descripciones[b].start && entities[i].end < descripciones[b].end)
					noticia = noticias[b];
			}
			var boton = '<a href="'+entities[i].uri+'">'+entities[i].label+'</a>';
			noticia.find('div.related').append(boton);
		}
	}, 'json');
}

function clickBotonBusqueda(){
	var id = $(this).attr('id');
	diarioActivo = id;
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