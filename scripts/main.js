var cnn = {id:"cnn",baseColor:""},
    dailyMail = {id:"daily-mail",baseColor:""},
    espn = {id:"espn",baseColor:""},
    marca = {id:"marca",baseColor:""},
    theNewYorkTimes = {id:"the-new-york-times",baseColor:"#263238"},
    foxSports = {id:"fox-sports",baseColor:""};

var key = "d1eae06defad4bb29383968c90e85a4b";
var parameters = {
	"apiKey": key,
	"sources": foxSports.id,
	"from":"2018-08-07",
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
	for (var i = 0; i < data.articles.length; i++) {
		//alert(JSON.stringify(data.articles[i]));
		//$('div.noticia').clone().appendTo('main'); 
	}
	alert(data.articles.length);
})
.fail(function() {
	alert("Error obtaining JSON");
});