$(document).ready(function() {

   drinkList = ["1", "2", "3"];
   recipeList = ["a", "b", "c"];
   movieList = ["Inception", "Matrix", "Friends"];

$("#random-button").on("click", function(event) {
  event.preventDefault();

getDrink();

getMovie();

getRecipe();

$("#movieRandom").on("click", function(event) {
  getMovie();
});

$("#recipeRandom").on("click", function(event) {
  getRecipe();
});

$("#drinkRandom").on("click", function(event) {
  getDrink();
});

});

//function to get random drink
function getDrink () {

  $("#ingredients").empty()
    
  var drinkUrl = "https://www.thecocktaildb.com/api/json/v1/1/random.php";

  $.ajax({

      url: drinkUrl,
      method: "GET"

      //on error show apologies and have a drink on us (use stored image)
      
  }).then(function(drinkResponse) {

    console.log(drinkResponse.drinks[0]);
    var drinkImageUrl = drinkResponse.drinks[0].strDrinkThumb
    //$("#drinkImage").attr("src", drinkImageUrl)
    $("#drinkImage").css("background-image", "url("+drinkImageUrl+")")

    var drinkName = drinkResponse.drinks[0].strDrink
    $("#drinkName").text(drinkName)
    //var drinkInstruct = drinkResponse.drinks[0].strInstructions

      ingredientHeader = $("<p>").text("Ingredients:")
      ingredientHeader.attr("id", "ingredientHeader")
      
      $("#ingredients").append(ingredientHeader)
      
      getDrinkIngredients(drinkResponse)
          
    var newDrink = $("<button>");
    newDrink.addClass("button").text(drinkName);
    $("#drink-history").append(newDrink);
    $(".drink-button")
      .first()
      .remove();
    drinkList.shift();
    var drinkEl = { drinkNam: drinkName, drinkImg: drinkImageUrl, content: $("#ingredientHeader").text()};
    drinkList.push(drinkEl);
    localStorage.setItem("drinkHistory", JSON.stringify(drinkList));          
      
  });
}

function getDrinkIngredients(drinkResponse) {
  
  $("#ingredientHeader").empty()
  
  var ingredientIndexArray = []
  var measureIndexArray = []

  for (i=1; i<=15; i++) {
    //console.log(i);
    var ingredientIndex = "strIngredient" + [i]
    // console.log(ingredientIndex);
    ingredientIndexArray.push(ingredientIndex)

    var measureIndex = "strMeasure" + [i]
    measureIndexArray.push(measureIndex)
        
  }

  for (i=0; i<ingredientIndexArray.length; i++) {
    //console.log(ingredientIndexArray[i]);
    var ingredientNo = ingredientIndexArray[i];
    var ingredient = drinkResponse.drinks[0][ingredientNo];
    var measureNo = measureIndexArray[i];
    var measure = drinkResponse.drinks[0][measureNo];
    //console.log(ingredientNo);
    //console.log(ingredient);

    if (ingredient != null) {

      ingredientHTML = $("<p>").text(ingredient + " - " + measure);
      ingredientHTML.attr("id",[i]);
      $("#ingredientHeader").append(ingredientHTML);
        
    }
  }

  getDrinkInstructions(drinkResponse)

}

});

function getDrinkInstructions(drinkResponse) {

  var instruction = drinkResponse.drinks[0].strInstructions
  console.log(instruction);

  instructionHeader = $("<p>").text("Instructions:")
  instructionText = $("<p>").text(instruction)

  instructionHeader.append(instructionText)
  $("#ingredientHeader").append(instructionHeader)

}

function getMovie() {

  $("#movieInfo").empty()
  
  var movieUrl = "https://api.themoviedb.org/3/discover/movie?api_key=f239018644aca27fb1793b1dbcab8d4c"

  $.ajax({
    url: movieUrl,
    method: "GET"

  }).then(function(movieResponse) {
    
    var movieID = Math.floor(Math.random() * 19);
    console.log(movieResponse.results[movieID]);
    var movie = movieResponse.results[movieID].title
    var poster = "https://image.tmdb.org/t/p/original" + movieResponse.results[movieID].poster_path
    var rating = movieResponse.results[movieID].vote_average + "/10"
    var plot = movieResponse.results[movieID].overview
    
    $("#movieName").text(movie)

  
    $("#movieImage").css("background-image", "url("+poster+")")
    
    ratingHeader = $("<p>").text("Rating:")
    ratingText = $("<p>").text(rating)
    plotHeader = $("<p>").text("Plot:")
    plotText = $("<p>").text(plot)
    breakHTML = $("<br>")
    
    $("#movieInfo").append(ratingHeader, ratingText, breakHTML, plotHeader, plotText)

    var newMovie = $("<button>");
    newMovie.addClass("button").text(movie);
    $("#movie-history").append(newMovie);
    $(".movie-button").first().remove();
    movieList.shift();
    var movieEl = {movNam: movie, movImg: poster, movRate: rating, movPlot: plot};
    movieList.push(movieEl);
    localStorage.setItem("movieHistory", JSON.stringify(movieList));
  })
}

function getRecipe() {

  $("#recipeSummary").empty()

  var recipeUrl = "https://api.spoonacular.com/recipes/random?apiKey=7c0986ad6c3445a491cf76f7d2a655ab"

  $.ajax({
    url: recipeUrl,
    method: "GET"
  }).then(function(recipeResponse) {

    console.log(recipeResponse.recipes[0]);
    var recipeImage = recipeResponse.recipes[0].image
    var recipeName = recipeResponse.recipes[0].title
    var recipeSummary = recipeResponse.recipes[0].summary

    summaryHTML = $("<p>").text(recipeSummary)

    $("#recipeImage").css("background-image", "url("+recipeImage+")")
    $("#recipeName").text(recipeName)
    $("#recipeSummary").append(recipeSummary)

    var newRecipe = $("<button>");
    newRecipe.addClass("button").text(recipeName);
    $("#recipe-history").append(newRecipe);
    $(".recipe-button")
      .first()
      .remove();
    recipeList.shift();
    var recipeEL = {reciImg: recipeImage,  reciNam: recipeName, reciSum: recipeSummary};
    recipeList.push(recipeEL);
    localStorage.setItem("recipeHistory", JSON.stringify(recipeList));
  })

}
