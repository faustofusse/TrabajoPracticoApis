var cnn = {id:"cnn",baseColor:""},
    dailyMail = {id:"daily-mail",baseColor:""},
    espn = {id:"espn",baseColor:""},
    marca = {id:"marca",baseColor:""},
    theNewYorkTimes = {id:"the-new-york-times",baseColor:"#263238"},
    foxSports = {id:"fox-sports",baseColor:""};

var key = "d1eae06defad4bb29383968c90e85a4b";
var parameters = {
	"apiKey": key,
	"sources": dailyMail.id,
	"from":"2015-08-07",
	//"sortBy":"popularity"
};

$.ajax({
	//url: 'https://newsapi.org/v2/sources?' + key,
	//url: 'https://newsapi.org/v2/top-headlines?' + $.param(parameters),
	url: 'https://newsapi.org/v2/everything?' + $.param(parameters),
	type: 'GET',
	dataType: 'json',
})
.done(function(data) {
	//$('p').html(JSON.stringify(data));
	//alert(JSON.stringify(data.articles));
	var noticia = $('div.noticia');
	for (var i = 0; i < data.articles.length; i++) {
		//alert(JSON.stringify(data.articles[i]));
		var clon = noticia.clone();
		clon.find('h2').html(data.articles[i].title);
		clon.find('h3').html(data.articles[i].description);
		clon.find('img').attr('src',data.articles[i].urlToImage);
		var fuente = data.articles[i].source.name + " - " + data.articles[i].publishedAt;
		clon.find('span').html(fuente);
		clon.appendTo('main'); 
	}
	noticia.css('display', 'none');
})
.fail(function() {
	alert("Error obtaining JSON");
});