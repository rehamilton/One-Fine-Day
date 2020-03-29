$(document).ready(function() {
  drinkList = ["drink 1", "drink 2", "drink 3"];
  recipeList = ["recipe 1", "recipe 2", "recipe 3"];
  movieList = ["Movie 1", "Movie 2", "Movie 3"];
  init();

  $("#random-button").on("click", function(event) {
    event.preventDefault();

    getDrink();

    getMovie();

    getRecipe();
  });

  $("#drinkRandom").on("click", function() {
    getDrink();
  });

  $("#recipeRandom").on("click", function() {
    getRecipe();
  });

  $("#movieRandom").on("click", function() {
    getMovie();
  });

  //click on any drink buttons to display content
  $("#drink-history").on("click", function(event) {
    event.preventDefault();
    var drinkIndex = drinkList.findIndex(
      i => i.drinkNam === event.target.innerHTML
    );
    var drinkHistory = JSON.parse(localStorage.getItem("drinkHistory"));
    $("#drinkImage").css(
      "background-image",
      "url(" + drinkHistory[drinkIndex].drinkImg + ")"
    );
    $("#drinkName").text(drinkHistory[drinkIndex].drinkNam);
    $("#ingredients").text(drinkHistory[drinkIndex].content);
  });

  //click on any recipe buttons to display content
  $("#recipe-history").on("click", function(event) {
    event.preventDefault();
    var reciIndex = recipeList.findIndex(
      i => i.reciNam === event.target.innerHTML
    );
    var recipeHistory = JSON.parse(localStorage.getItem("recipeHistory"));
    $("#recipeImage").css(
      "background-image",
      "url(" + recipeHistory[reciIndex].reciImg + ")"
    );
    $("#recipeName").text(recipeHistory[reciIndex].reciNam);
    $("#recipeSummary").text(recipeHistory[reciIndex].reciSum);
  });

  //click on any movie buttons to display content
  $("#movie-history").on("click", function(event) {
    event.preventDefault();
    var movIndex = movieList.findIndex(
      i => i.movNam === event.target.innerHTML
    );
    var movHistory = JSON.parse(localStorage.getItem("movieHistory"));
    $("#movieImage").css(
      "background-image",
      "url(" + movHistory[movIndex].movImg + ")"
    );
    $("#movieName").text(movHistory[movIndex].movNam);
    $("#movieInfo").text(movHistory[movIndex].movRate);
    $("#movieInfo").append($("<p>").text(movHistory[movIndex].movPlot));
  });

  //function to get random drink
  function getDrink() {
    $("#ingredients").empty();

    var drinkUrl = "https://www.thecocktaildb.com/api/json/v1/1/random.php";

    $.ajax({
      url: drinkUrl,
      method: "GET"

      //on error show apologies and have a drink on us (use stored image)
    }).then(function(drinkResponse) {
      console.log(drinkResponse.drinks[0]);
      var drinkImageUrl = drinkResponse.drinks[0].strDrinkThumb;
      //$("#drinkImage").attr("src", drinkImageUrl)
      $("#drinkImage").css("background-image", "url(" + drinkImageUrl + ")");

      var drinkName = drinkResponse.drinks[0].strDrink;
      $("#drinkName").text(drinkName);
      //var drinkInstruct = drinkResponse.drinks[0].strInstructions

      ingredientHeader = $("<p>").text("Ingredients:");
      ingredientHeader.attr("id", "ingredientHeader");

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
      var drinkEl = {
        drinkNam: drinkName,
        drinkImg: drinkImageUrl,
        content: $("#ingredientHeader").text()
      };
      drinkList.push(drinkEl);
      localStorage.setItem("drinkHistory", JSON.stringify(drinkList));
    });
  }

  function getDrinkIngredients(drinkResponse) {
    $("#ingredientHeader").empty();

    var ingredientIndexArray = [];
    var measureIndexArray = [];

    for (i = 1; i <= 15; i++) {
      //console.log(i);
      var ingredientIndex = "strIngredient" + [i];
      // console.log(ingredientIndex);
      ingredientIndexArray.push(ingredientIndex);

      var measureIndex = "strMeasure" + [i];
      measureIndexArray.push(measureIndex);
    }

    for (i = 0; i < ingredientIndexArray.length; i++) {
      //console.log(ingredientIndexArray[i]);
      var ingredientNo = ingredientIndexArray[i];
      var ingredient = drinkResponse.drinks[0][ingredientNo];
      var measureNo = measureIndexArray[i];
      var measure = drinkResponse.drinks[0][measureNo];
      //console.log(ingredientNo);
      //console.log(ingredient);

      if (ingredient != null) {
        ingredientHTML = $("<p>").text(ingredient + " - " + measure);
        ingredientHTML.attr("id", [i]);
        $("#ingredientHeader").append(ingredientHTML);
      }
    }

    getDrinkInstructions(drinkResponse);
  }

  function getDrinkInstructions(drinkResponse) {
    var instruction = drinkResponse.drinks[0].strInstructions;
    console.log(instruction);

    instructionHeader = $("<p>").text("Instructions:");
    instructionText = $("<p>").text(instruction);

    instructionHeader.append(instructionText);
    $("#ingredientHeader").append(instructionHeader);
  }

  function getRecipe() {
    $("#recipeSummary").empty();

    var recipeUrl =
      "https://api.spoonacular.com/recipes/random?apiKey=7c0986ad6c3445a491cf76f7d2a655ab";

    $.ajax({
      url: recipeUrl,
      method: "GET"
    }).then(function(recipeResponse) {
      console.log(recipeResponse.recipes[0]);
      var recipeImage = recipeResponse.recipes[0].image;
      var recipeName = recipeResponse.recipes[0].title;
      var recipeSummary = recipeResponse.recipes[0].summary;

      summaryHTML = $("<p>").text(recipeSummary);

      $("#recipeImage").css("background-image", "url(" + recipeImage + ")");
      $("#recipeName").text(recipeName);
      $("#recipeSummary").append(recipeSummary);

      //render recipe history buttons
      var newRecipe = $("<button>");
      newRecipe.addClass("button recipe-button").text(recipeName);
      $("#recipe-history").append(newRecipe);
      $(".recipe-button")
        .first()
        .remove();
      recipeList.shift();
      var recipeEL = {
        reciImg: recipeImage,
        reciNam: recipeName,
        reciSum: recipeSummary
      };
      recipeList.push(recipeEL);
      localStorage.setItem("recipeHistory", JSON.stringify(recipeList));
    });
  }

  function getMovie() {
    $("#movieInfo").empty();

    var movieUrl =
      "https://api.themoviedb.org/3/discover/movie?api_key=f239018644aca27fb1793b1dbcab8d4c";

    $.ajax({
      url: movieUrl,
      method: "GET"
    }).then(function(movieResponse) {
      var movieID = Math.floor(Math.random() * 19);
      console.log(movieResponse.results[movieID]);
      var movie = movieResponse.results[movieID].title;
      var poster =
        "https://image.tmdb.org/t/p/original" +
        movieResponse.results[movieID].poster_path;
      var rating = movieResponse.results[movieID].vote_average + "/10";
      var plot = movieResponse.results[movieID].overview;

      $("#movieName").text(movie);

      $("#movieImage").css("background-image", "url(" + poster + ")");

      ratingHeader = $("<p>").text("Rating:");
      ratingText = $("<p>").text(rating);
      plotHeader = $("<p>").text("Plot:");
      plotText = $("<p>").text(plot);
      breakHTML = $("<br>");

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
      var movieEl = {
        movNam: movie,
        movImg: poster,
        movRate: rating,
        movPlot: plot
      };
      movieList.push(movieEl);
      localStorage.setItem("movieHistory", JSON.stringify(movieList));
    });
  }

  function init() {
    //keep last three random history
    var drinkHistory = JSON.parse(localStorage.getItem("drinkHistory"));
    if (drinkHistory == null) {
      localStorage.setItem("drinkHistory", JSON.stringify(drinkList));
      for (var i = 0; i < drinkList.length; i++) {
        $("#drink-" + i).text(drinkList[i]);
      }
    } //handle first time use
    drinkList = drinkHistory;
    for (var i = 0; i < drinkHistory.length; i++) {
      $("#drink-" + i).text(drinkHistory[i].drinkNam);
    }

    var recipeHistory = JSON.parse(localStorage.getItem("recipeHistory"));
    if (recipeHistory == null) {
      localStorage.setItem("recipeHistory", JSON.stringify(recipeList));
      for (var i = 0; i < recipeList.length; i++) {
        $("#recipe-" + i).text(recipeList[i]);
      }
    } //handle first time use
    recipeList = recipeHistory;
    for (var i = 0; i < recipeHistory.length; i++) {
      $("#recipe-" + i).text(recipeHistory[i].reciNam);
    }

    var movHistory = JSON.parse(localStorage.getItem("movieHistory"));
    if (movHistory == null) {
      localStorage.setItem("movieHistory", JSON.stringify(movieList));
      for (var i = 0; i < movieList.length; i++) {
        $("#movie-" + i).text(movieList[i]);
      }
    } //handle first time use
    movieList = movHistory;
    for (var i = 0; i < movHistory.length; i++) {
      $("#movie-" + i).text(movHistory[i].movNam);
    }
  }
});
