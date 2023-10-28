import {API_KEY,IMBD_ID,BASE_URL} from './config.js';

const url = new URL(window.location.href);
const parameterValue = url.searchParams.get('id');
console.log(parameterValue);
var favourites =[];

var searchList = document.createElement("div");
searchList.id="list-container";
//function to render suggestions during search
var renderSuggestionsElement = function(movieList){
    let formContainer= document.getElementById("form-container");
    let element = document.getElementById("list-container");
    console.log(element);
    if(element !=null)
    {
      element.innerHTML="";
    } 
    formContainer.appendChild(searchList);
    movieList.forEach((movie)=>{
        if(movie.Poster=='N/A')
        {
          movie.Poster="home.jpg";
        }
        searchList.innerHTML +=`<a class="list-link" href="movie.html?id=${movie.imdbID}">
                                  <div class="search-result"}">
                                      <div class="image-container">
                                          <img src="${movie.Poster}" class="suggestion-class" alt="no image""/>
                                      </div>
                                      <div class="search-details"">
                                        <div><span>Title:&nbsp${movie.Title}</span></div>
                                        <div><span>Year:&nbsp${movie.Year}</span></div>
                                      </div>
                                  </div>
                                </a>
                                `
                              });
    // var searchResult = document.querySelectorAll(".search-result");
    // if(searchResult!=null && searchResult.length>0)
    // {
    //   searchResult.forEach((res)=>{
    //     res.addEventListener('click',getMovieByID);
    //   })
    // }
    return;
  }
  
  //Called on change in the input 
  var renderList = async function (event) {
      
      if(event.target.value != "")
      { 
        var URI = `${BASE_URL}?s=${event.target.value}&type=movie&page=1&apikey=${API_KEY}`;
        console.log(URI);
        try{
          var response = await fetch(URI);
          var res = await response.json();
          console.log(res);
          if(!res.Response)
          {
            throw new Error("No data found");
          }
          else{
            renderSuggestionsElement(res.Search);
          }
        }
        catch(error){
         console.log(error);
        }
      }
      return;   
  };
  
  
  
  
  


//function to add favourites to the wishlist
var addFavourites= function(Id){

    let remove =false;
    if(localStorage.getItem("favourite-list")!=null)
    {
      let stringFavourites=localStorage.getItem("favourite-list");
      let favouritesArray = JSON.parse(stringFavourites);
  
      favouritesArray.forEach((movie)=>{if(movie==Id){
          remove = true;
      }});
      if(remove)
      {
        var filtered=favouritesArray.filter((movie)=>{return movie!=Id}); 
        localStorage.setItem("favourite-list",JSON.stringify(filtered));
        alert("removed from favourites");
        
      }    
      else
      {
        favouritesArray.push(Id);
        localStorage.setItem("favourite-list",JSON.stringify(favouritesArray));
        alert("Added to favourites");
        
      }
    }
    else{
      favourites.push(Id);
      let stringFavourites = JSON.stringify(favourites);
      localStorage.setItem("favourite-list",stringFavourites);
      console.log(localStorage.getItem("favourite-list"));
      
    }
    return;
   
  }

//function to render the selected movie
var renderMovieElement = function(data){
      //title
      console.log("hello",data);
      var titleSpan = document.getElementById("title-name");
      titleSpan.innerHTML=`<span class="title-span">${data.Title}</span>`;
      //year
      document.getElementById("year").innerHTML=data.Year;
      //pg rating
      document.getElementById("pg-rating").innerHTML=data.Rated;
      //Duration
      document.getElementById("duration").innerHTML=data.Runtime;
      //IMDB Rating
      document.getElementById("rating-span").innerHTML=data.imdbRating;
      //votes
        var newString = data.imdbVotes.replace(",","");
        console.log(newString);
        var votes =Math.floor(parseInt(newString,10)/1000);
      document.getElementById("votes-span").innerHTML=votes;
      //poster
      var posterElement = document.getElementById("poster-img");
      posterElement.setAttribute('src',`${data.Poster}`);
      //favourite icon id
      var eleIcon= document.getElementById("favourite-icon");
      eleIcon.setAttribute("data-ID",`${data.imdbID}`);
      eleIcon.addEventListener('click',(event)=>{addFavourites(eleIcon.getAttribute("data-ID"))
                                                 event.preventDefault();
                                                 event.stopPropagation();
                                                });
      //Movie container Background
      var movieContainer = document.getElementById("background"); 

      movieContainer.style.backgroundImage=`url(${data.Poster})`;
      //Genre
      let genre = data.Genre.split(",");
      let genreElement= document.getElementById("genre");
      genre.forEach((gen)=>{
          let genInner =document.createElement("div");
          genInner.innerHTML=`<span>${gen}</span>`;
          console.log(genInner);
          genreElement.appendChild(genInner);
  
      })
      //Plot
      let plotElement= document.getElementById("plot-div");
      plotElement.innerHTML="";
      let plotInner =document.createElement("div");
      plotInner.innerHTML=`<span>Plot:&nbsp${data.Plot}</span>`;
      plotElement.appendChild(plotInner);
      //Director
      let dirElement= document.getElementById("director-div");
      dirElement.innerHTML="";
      let dirInner =document.createElement("div");
      dirInner.innerHTML=`<span>Director:&nbsp${data.Director}</span>`;
      dirElement.appendChild(dirInner);
      //Writers
      let wriElement= document.getElementById("writers-div");
      wriElement.innerHTML="";
      let wriInner =document.createElement("div");
      wriInner.innerHTML=`<span>Writer:&nbsp${data.Writer}</span>`;
      wriElement.appendChild(wriInner);
      //Stars
      let starElement= document.getElementById("stars-div");
      starElement.innerHTML="";
      let starInner =document.createElement("div");
      starInner.innerHTML=`<span>Actor:&nbsp${data.Actors}</span>`;
      starElement.appendChild(starInner);
  
      //unhide MovieContainer
      document.getElementById("movie-container").style.display="block";
  
  }


//function to fetch movie from its ID
var fetchMovieByID = async function(id)
{
  try{
    let URI= `${BASE_URL}?i=${id}&&apikey=${API_KEY}`;
    let res = await fetch(URI);
    let resJson = await res.json();
    return resJson;
  }
  catch(error)
  {
    console.log(error);
  }
} 

var getMovieByID = function(parameterValue){
    let dataPromise = fetchMovieByID(parameterValue);
    dataPromise.then((d) =>{renderMovieElement(d)}); 
}

getMovieByID(parameterValue);