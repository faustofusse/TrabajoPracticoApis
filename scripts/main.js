var newsApi = {
	url: "https://newsapi.org/v2/everything?",
	key: "d1eae06defad4bb29383968c90e85a4b",
	parameters: {
		apiKey: "d1eae06defad4bb29383968c90e85a4b",
		sources: "cnn"
	}
};
var noticia = $('div.noticia');
var ultimaNoticia;
$('div.noticia').remove();

$.get(newsApi.url + $.param(newsApi.parameters), function (data, status){
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
}, "json");