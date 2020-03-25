$(document).ready(function() {

$("#random-button").on("click", function(event) {
  event.preventDefault();

getDrink()

getMovie()

//function to get random drink
function getDrink () {
    
    var drinkUrl = "https://www.thecocktaildb.com/api/json/v1/1/random.php";

    $.ajax({

        url: drinkUrl,
        method: "GET"

        //on error show apologies and have a drink on us (use stored image)
        
    }).then(function(drinkResponse) {

        console.log(drinkResponse.drinks[0]);
        var drinkImageUrl = drinkResponse.drinks[0].strDrinkThumb
        $("#drinkImage").attr("src", drinkImageUrl)

        var drinkName = drinkResponse.drinks[0].strDrink
        $("#drinkName").text(drinkName)
        //var drinkInstruct = drinkResponse.drinks[0].strInstructions
        
        getDrinkIngredients(drinkResponse)
            
            
        
    });
}

function getDrinkIngredients(drinkResponse) {
    var ingredientIndexArray = []
    var measureIndexArray = []

        for (i=1; i<=15; i++) {
            // console.log(i);
            var ingredientIndex = "strIngredient" + [i]
            // console.log(ingredientIndex);
            ingredientIndexArray.push(ingredientIndex)

            var measureIndex = "strMeasure" + [i]
            measureIndexArray.push(measureIndex)
            
            
        }

        // console.log(ingredientIndexArray);
        console.log(measureIndexArray);

        for (i=0; i<ingredientIndexArray.length; i++) {
            //console.log(ingredientIndexArray[i]);
            var ingredientNo = ingredientIndexArray[i];
            var ingredient = drinkResponse.drinks[0][ingredientNo];
            var measureNo = measureIndexArray[i];
            var measure = drinkResponse.drinks[0][measureNo];
            //console.log(ingredientNo);
            console.log(ingredient);

            if (ingredient != null) {

                ingredientHTML = $("<p>").text(ingredient + " - " + measure);
                ingredientHTML.attr("id",[i]);
                $("#ingredients").append(ingredientHTML);
                
            }
        }

}

});

function getMovie() {
  var movieKey = "73c47b3bcb013637f6b5dec34d836076";

  //get latest movie id
  var maxMovieID = "";
  var latestMv =
    "https://api.themoviedb.org/3/movie/latest?api_key=" + movieKey + "&language=en-US";
   $.ajax({
     url: latestMv,
     method: "GET"
   }).then(function(response) {
      maxMovieID = response.id;
   }) 


  var movieID = Math.floor(Math.random() * maxMovieID);
  var queryURL = "https://api.themoviedb.org/3/movie/" + movieID + "?api_key=" + movieKey;
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    console.log(response);

    $("#movie-img").attr("src", response.poster_path);
    $("#movie-text").text(response.overview);
    
  })
}


})
