
/*----------------------- VARIABLES -----------------------*/

var key = "d1eae06defad4bb29383968c90e85a4b";
var newsApi = {
	url: "https://newsapi.org/v2/everything?" + "apiKey=" + key,
	parameters: {
		from: fecha,
		to: fecha,
		//country: "ar",
		sources: "infobae",
		//language: "en",
		//q: "", // Palabra clave
	}
};

var diarios = [{id:"cnn",baseColor:"#263238",colorHover:"#1565c0"},
    	{id:"daily-mail",baseColor:"#263238",colorHover:"#1565c0"},
    	{id:"bbc-news",baseColor:"#263238",colorHover:"#1565c0"},
    	{id:"marca",baseColor:"#263238",colorHover:"#1565c0"},
    	{id:"the-new-york-times",baseColor:"#263238",colorHover:"#1565c0"},
    	{id:"fox-sports",baseColor:"#263238",colorHover:"#1565c0"}];
var diarioActivo = diarios[0];

var noticia = $('div.noticia');
var ultimaNoticia;
$('div.noticia').remove();

var fecha = ""; 
var date = new Date();
var day = date.getDate(); var daysPast = 0;
var month = date.getMonth()+1; var monthsPast = 0;
var year = date.getFullYear(); var yearsPast = 0;
var	fecha = getYear() + "-" + getMonth() + "-" + getDay();
rellenarContenido();


/*----------------------- EVENTOS -----------------------*/

$('header nav div.diarios button').click(function() {
	var id = $(this).attr('id');
	diarioActivo = findDiarioBySource(id);
	newsApi.parameters.sources = diarioActivo.id;
	//$(this).css('background-color', diarioActivo.colorHover);
	$('div.noticia').remove();
	rellenarContenido();
});

$('#floatingButton').click(function() {
	$("html, body").animate({scrollTop: 0}, "slow");
});

$('button#editar').click(function() {
	$('header nav div.diarios button i').slideToggle(0);
});

$('button#agregarDiario').click(function() {
	$('header h1').slideUp();
	$('header > button').slideUp();
	$("html, body").animate({scrollTop: 0}, "slow").css('overflow', 'hidden');;
	$('div.opciones input').animate({width: '20em', padding: '1em'}, 300);
	$('div.opciones input').focus();
});

$('div.opciones input').focusout(function() {
	$('html, body').css('overflow', 'auto');
	$('header h1').slideDown();
	$('header > button').slideDown();
	$(this).animate({width: '0', padding: '0'}, 300);
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
});

/*----------------------- FUNCIONES -----------------------*/

function rellenarContenido(){
	newsApi.parameters.from = fecha;
	newsApi.parameters.to = fecha;
	//newsApi.parameters.sources = "ole";
	$.get(newsApi.url, newsApi.parameters, function (data, status) {
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
		ultimaNoticia = $('div.noticia:last');
		ultimaNoticia.css('background-color', 'blue');
	}, 'json');
}

function findDiarioBySource(source){
	for (var i = 0; i < diarios.length; i++) {
		if (source === diarios[i].id)
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