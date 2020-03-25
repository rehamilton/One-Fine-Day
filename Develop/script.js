$(document).ready(function() {

var movieKey = "d4f7630d";

$("#random-button").on("click", function(event) {
  event.preventDefault();

  var randomNum = "";
  for (var i = 0; i < 7; i++) {
    var number = Math.floor(Math.random() * 10);
    randomNum += number;
  }
  var movieID = "tt" + randomNum;
//   var queryURL = "https://www.omdbapi.com/?i=" + movieID + "&apikey=" + movieKey;
  var queryURL = "http://www.omdbapi.com/?i=tt1375666&apikey=d4f7630d";
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    console.log(response);

    var posterDiv = $("<img>");
    posterDiv.attr("id", "poster-view");
    posterDiv.attr("src", response.Poster);
    $("#movie-view").prepend(posterDiv);

    var ratedDiv = $("<div>");
    ratedDiv.attr("id", "rated-view");
    $("#movie-view").prepend(ratedDiv);
    $("#rated-view").text("Rated: " + response.Rated);

    var titleDiv = $("<div>");
    titleDiv.attr("id", "title-view");
    $("#movie-view").prepend(titleDiv);
    $("#title-view").text("Title: " + response.Title);
  });
})
});