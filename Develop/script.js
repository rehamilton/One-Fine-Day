$(document).ready(function() {
  drinkList = ["drink 1", "drink 2", "drink 3"];
  recipeList = ["recipe 1", "recipe 2", "recipe 3"];
  movieList = ["Movie 1", "Movie 2", "Movie 3"];
  init();
  var drinkAjaxing = false;
  var recipeAjaxing = false;
  var movieAjaxing = false;

  //get random items when button is clicked. Don't activate randomize buttons until  
  $("#random-button").on("click", function(event) {   
    event.preventDefault();

    getDrink();

    getMovie();

    getRecipe();
  
    // create another random selection when these buttons are clicked
    $("#drinkRandom").on("click", function() {
      getDrink();
    });

    $("#recipeRandom").on("click", function() {
      getRecipe();
    });

    $("#movieRandom").on("click", function() {
      getMovie();
    });
  });

  //click on any drink buttons to display content
  $("#drink-history").on("click", function(event) {
    event.preventDefault();
    
    //remove previous information
    $("#ingredients").empty();
    
    //get drinkList from local storage
    var drinkIndex = drinkList.findIndex(
      i => i.drinkNam === event.target.innerHTML
    );
    var drinkHistory = JSON.parse(localStorage.getItem("drinkHistory"));
    
    //add responses to existing HTML
    $("#drinkImage").css(
      "background-image",
      "url(" + drinkHistory[drinkIndex].drinkImg + ")"
    );
    $("#drinkName").text(drinkHistory[drinkIndex].drinkNam);

    //move to ingredient info start with header
    ingredientHead = $("<p>").text("Ingredients:");
    ingredientHead.attr("class", "has-text-weight-bold");
    $("#ingredients").append(ingredientHead);

    //get all ingredients from object and create new HTML for each
    for (i = 0; i < drinkHistory[drinkIndex].ingredients.length; i++) {
      ingredientHTML = $("<p>").text(drinkHistory[drinkIndex].ingredients[i]);
      ingredientHTML.attr("id", [i]);
      $("#ingredients").append(ingredientHTML);
    }

    //create new HTML for instruction response
    instructionHeader = $("<p>").text("Instructions:");
    instructionHeader.attr("class", "has-text-weight-bold");

    instructionText = $("<p>").text(drinkHistory[drinkIndex].instruction);
    instructionText.attr("id", "instruction");
   
    //add new responses HTML to existing HTML
    $("#ingredients").append("<br>", instructionHeader, instructionText);
  });

  //click on any recipe buttons to display content
  $("#recipe-history").on("click", function(event) {
    event.preventDefault();

    //remove previous information
    $("#recipeSummary").empty();

    //get recipe information from local storage
    var reciIndex = recipeList.findIndex(
      i => i.reciNam === event.target.innerHTML
    );
    var recipeHistory = JSON.parse(localStorage.getItem("recipeHistory"));

    //create new HTM for responses
    recipeReadyHTML = $("<p>").text("Ready in " + recipeHistory[reciIndex].reciRea + " minutes");
    recipeServeHTML = $("<p>").text("Serves " + recipeHistory[reciIndex].reciSer + " people");
    recipeLinkHTML = $("<a>").text("Click here for recipe");
    recipeLinkHTML.attr("href", recipeHistory[reciIndex].reciLin);

    //append new HTML and responses to existing HTML
    $("#recipeImage").css(
      "background-image",
      "url(" + recipeHistory[reciIndex].reciImg + ")"
    );
    $("#recipeName").text(recipeHistory[reciIndex].reciNam);
    $("#recipeSummary").append(recipeHistory[reciIndex].reciSum);
    $("#recipeSummary").append(
      recipeReadyHTML,
      "<br>",
      recipeServeHTML,
      "<br>",
      recipeLinkHTML,
      "<br>",
      "<br>"
    );
  });

  //click on any movie buttons to display content
  $("#movie-history").on("click", function(event) {
    event.preventDefault();

    //remove previous information
    $("#movieInfo").empty();

    //get relevant stored movie information object
    var movIndex = movieList.findIndex(
      i => i.movNam === event.target.innerHTML
    );
    var movHistory = JSON.parse(localStorage.getItem("movieHistory"));

    //Populate image and movie name
    $("#movieImage").css(
      "background-image",
      "url(" + movHistory[movIndex].movImg + ")"
    );
    $("#movieName").text(movHistory[movIndex].movNam);
    
    //create HTML for movie information
    ratingHeader = $("<p>").text("Rating:");
    ratingHeader.attr("class", "has-text-weight-bold");
    ratingText = $("<p>").text(movHistory[movIndex].movRate);
    plotHeader = $("<p>").text("Plot:");
    plotHeader.attr("class", "has-text-weight-bold");
    plotText = $("<p>").text(movHistory[movIndex].movPlot);
    breakHTML = $("<br>");

    //place html to the info section of the card
    $("#movieInfo").append(
      ratingHeader,
      ratingText,
      breakHTML,
      plotHeader,
      plotText
    );
  });

  //function to get random drink
  function getDrink() {
    //stop multiple duplicate ajax requests
    if(drinkAjaxing) return;
    drinkAjaxing = true;

    // remove previous information
    $("#ingredients").empty();
    $("#drinkName").empty();

    //call from drink API "thecocktaildb"
    $.ajax({
      url: "https://www.thecocktaildb.com/api/json/v1/1/random.php",
      method: "GET"

    }).then(function(drinkResponse) {
      drinkAjaxing = false;
      //place image responses into existing HTML
      var drinkImageUrl = drinkResponse.drinks[0].strDrinkThumb;
      $("#drinkImage").css("background-image", "url(" + drinkImageUrl + ")");

      var drinkName = drinkResponse.drinks[0].strDrink;
      $("#drinkName").text(drinkName);

      //create HTML for information text
      ingredientHeader = $("<p>").text("Ingredients:");
      ingredientHeader.attr("id", "ingredientHeader");

      //add new HTML to existing HTML
      $("#ingredients").append(ingredientHeader);

      getDrinkIngredients(drinkResponse);

      //render drink history buttons
      var newDrink = $("<button>");
      newDrink.addClass("button drink-button").text(drinkName);
      $("#drink-history").append(newDrink);
      $(".drink-button")
        .first()
        .remove();
      drinkList.shift();


      var ingredients = [];
      for (i = 0; i <= 15; i++) {
        var ingredientsEl = $("#" + i).text();
        ingredients.push(ingredientsEl);
      }

      //create an object from current responses
      var drinkEl = {
        drinkNam: drinkName,
        drinkImg: drinkImageUrl,
        instruction: $("#instruction").text(),
        ingredients: ingredients
      };

      //push object to local storage
      drinkList.push(drinkEl);
      localStorage.setItem("drinkHistory", JSON.stringify(drinkList));
    });
  }

  function getDrinkIngredients(drinkResponse) {

    //remove previous information
    $("#ingredientHeader").empty();

    var ingredientIndexArray = [];
    var measureIndexArray = [];

    //start with header
    ingredientHead = $("<p>").text("Ingredients:");
    ingredientHead.attr("class", "has-text-weight-bold");
    $("#ingredientHeader").append(ingredientHead);

    //there are 15 instructions in each API response go through and create the names associated within the response and make an array from them
    for (i = 1; i <= 15; i++) {
     
      var ingredientIndex = "strIngredient" + [i];
      ingredientIndexArray.push(ingredientIndex);

      var measureIndex = "strMeasure" + [i];
      measureIndexArray.push(measureIndex);
    }

    //go through the new array and get responses 
    for (i = 0; i < ingredientIndexArray.length; i++) {
      var ingredientNo = ingredientIndexArray[i];
      var ingredient = drinkResponse.drinks[0][ingredientNo];
      var measureNo = measureIndexArray[i];
      var measure = drinkResponse.drinks[0][measureNo];
     
      // remove responses with no text or "-" only. Place text responses into HTML
      if (ingredient != null && ingredient != "-") {
        ingredientHTML = $("<p>").text(ingredient + " - " + measure);
        ingredientHTML.attr("id", [i]);
        $("#ingredientHeader").append(ingredientHTML);
      }
    }

    //add spacing for aesthetics
    $("#ingredientHeader").append("<br>");

    getDrinkInstructions(drinkResponse);
  }

  function getDrinkInstructions(drinkResponse) {

    //get instruction response from API
    var instruction = drinkResponse.drinks[0].strInstructions;

    //start with header HTML
    instructionHeader = $("<p>").text("Instructions:");
    instructionHeader.attr("class", "has-text-weight-bold");

    //place response into new HTML
    instructionText = $("<p>").text(instruction);
    instructionText.attr("id", "instruction");
    
    //append both to existing HTML
    $("#ingredientHeader").append(instructionHeader, instructionText);
  }

  function getRecipe() {
    //stop multiple duplicate ajax requests
    if (recipeAjaxing) return;
    recipeAjaxing = true;    

    //remove previous information
    $("#recipeSummary").empty();
    $("#recipeName").empty();

    //call from recipe API "spoonacular"
    $.ajax({
      url: "https://api.spoonacular.com/recipes/random?apiKey=7c0986ad6c3445a491cf76f7d2a655ab",
      method: "GET"
    }).then(function(recipeResponse) {
      recipeAjaxing = false;
      //get responses required to populate card
      var recipeImage = recipeResponse.recipes[0].image;
      var recipeName = recipeResponse.recipes[0].title;
      var recipeReady = recipeResponse.recipes[0].readyInMinutes;
      var recipeServe = recipeResponse.recipes[0].servings;
      var recipeLink = recipeResponse.recipes[0].sourceUrl;

      //create new HTML for information
      recipeReadyHTML = $("<p>").text("Ready in " + recipeReady + " minutes");
      recipeServeHTML = $("<p>").text("Serves " + recipeServe + " people");
      recipeLinkHTML = $("<a>").text("Click here for recipe");
      recipeLinkHTML.attr("href", recipeLink);

      //place responses and new HTML into existing HTML
      $("#recipeImage").css("background-image", "url(" + recipeImage + ")");
      $("#recipeName").text(recipeName);
      $("#recipeSummary").append(
        recipeReadyHTML,
        "<br>",
        recipeServeHTML,
        "<br>",
        recipeLinkHTML,
        "<br>",
        "<br>"
      );

      //render recipe history buttons
      var newRecipe = $("<button>");
      newRecipe.addClass("button recipe-button").text(recipeName);
      $("#recipe-history").append(newRecipe);
      $(".recipe-button")
        .first()
        .remove();
      recipeList.shift();

      //create object from current response
      var recipeEL = {
        reciImg: recipeImage,
        reciNam: recipeName,
        reciRea: recipeReady,
        reciSer: recipeServe,
        reciLin: recipeLink
      };

      //push new object to local storage
      recipeList.push(recipeEL);
      localStorage.setItem("recipeHistory", JSON.stringify(recipeList));
    });
  }

  function getMovie() {
    //stop multiple duplicate ajax requests
    if (movieAjaxing) return;
    movieAjaxing = true;    

    //remove previous information
    $("#movieInfo").empty();

    //call from movie API "themoviedb"
    $.ajax({
      url: "https://api.themoviedb.org/3/discover/movie?api_key=f239018644aca27fb1793b1dbcab8d4c",
      method: "GET"
    }).then(function(movieResponse) {
      movieAjaxing = false;
      
      //get responses required for card
      var movieID = Math.floor(Math.random() * 19);
      var movie = movieResponse.results[movieID].title;
      var poster =
        "https://image.tmdb.org/t/p/original" +
        movieResponse.results[movieID].poster_path;
      var rating = movieResponse.results[movieID].vote_average + "/10";
      var plot = movieResponse.results[movieID].overview;

      //place responses into existing HTML
      $("#movieName").text(movie);
      $("#movieImage").css("background-image", "url(" + poster + ")");

      //create new HTML for rest of responses
      ratingHeader = $("<p>").text("Rating:");
      ratingHeader.attr("class", "has-text-weight-bold");
      ratingText = $("<p>").text(rating);
      plotHeader = $("<p>").text("Plot:");
      plotHeader.attr("class", "has-text-weight-bold");
      plotText = $("<p>").text(plot);
      breakHTML = $("<br>");

      //append new HTML to existing HTML
      $("#movieInfo").append(
        ratingHeader,
        ratingText,
        breakHTML,
        plotHeader,
        plotText
      );

      //render movie history buttons
      var newMovie = $("<button>");
      newMovie.addClass("button movie-button").text(movie);
      $("#movie-history").append(newMovie);
      $(".movie-button")
        .first()
        .remove();
      movieList.shift();

      //create object from current response
      var movieEl = {
        movNam: movie,
        movImg: poster,
        movRate: rating,
        movPlot: plot
      };

      //push new object to local storage
      movieList.push(movieEl);
      localStorage.setItem("movieHistory", JSON.stringify(movieList));
    });
  }

  //retrieve local storage
  function init() {
    //keep last three random history
    var drinkHistory = JSON.parse(localStorage.getItem("drinkHistory"));
    //handle first time use    
    if (drinkHistory == null) {
      localStorage.setItem("drinkHistory", JSON.stringify(drinkList));
      for (var i = 0; i < drinkList.length; i++) {
        $("#drink-" + i).text(drinkList[i]);
      }
    } else {
    drinkList = drinkHistory;
    for (var i = 0; i < drinkHistory.length; i++) {
      $("#drink-" + i).text(drinkHistory[i].drinkNam);
    }
  }

    var recipeHistory = JSON.parse(localStorage.getItem("recipeHistory"));
    //handle first time use    
    if (recipeHistory == null) {
      localStorage.setItem("recipeHistory", JSON.stringify(recipeList));
      for (var i = 0; i < recipeList.length; i++) {
        $("#recipe-" + i).text(recipeList[i]);
      }
    } else { 
    recipeList = recipeHistory;
    for (var i = 0; i < recipeHistory.length; i++) {
      $("#recipe-" + i).text(recipeHistory[i].reciNam);
    }
  }

    var movHistory = JSON.parse(localStorage.getItem("movieHistory"));
    //handle first time use
    if (movHistory == null) {
      localStorage.setItem("movieHistory", JSON.stringify(movieList));
      for (var i = 0; i < movieList.length; i++) {
        $("#movie-" + i).text(movieList[i]);
      }
    } else {
    movieList = movHistory;
    for (var i = 0; i < movHistory.length; i++) {
      $("#movie-" + i).text(movHistory[i].movNam);
    }
  }
}
});
