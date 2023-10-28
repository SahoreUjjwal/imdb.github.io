import {API_KEY,IMBD_ID,BASE_URL} from './config.js';




var removeFavourites = function (event){
    let stringFavourites=localStorage.getItem("favourite-list");
    let favouritesArray = JSON.parse(stringFavourites);
    let filtered=favouritesArray.filter((movie)=>{return movie!=event.target.getAttribute("data-ID")}); 
    localStorage.setItem("favourite-list",JSON.stringify(filtered));
    renderWishList();
    alert("removed from favourites");   
}

//function to render wishlist
var renderWishList=function(){
    let containerElement = document.getElementById("wishlist-container");
    let movieList =JSON.parse(localStorage.getItem("favourite-list"));
    if(movieList.length==0)
    {
        containerElement.innerHTML="List Empty!";
        return;
    }
   
    containerElement.innerHTML="";
    movieList.forEach((movie)=>{
    fetchMovieByID(movie).then((d)=>{
        console.log(d);
        let containerElement = document.getElementById("wishlist-container");
        //var link =document.createElement("a");
        //link.href=`movie.html?id=${d.imdbId}`;
        var item=document.createElement("div");
        item.id="wishlist-item";
        var poster = document.createElement("div");
        poster.id="wishlist-poster";
        var icon = document.createElement("i");
        icon.className="fa-regular fa-circle-xmark remove-button";
        icon.setAttribute("data-ID",d.imdbID);
        icon.addEventListener("click",removeFavourites);
        poster.appendChild(icon);
        var image=document.createElement("img");
        image.className="poster-wishlist";
        image.src=d.Poster;
        poster.appendChild(image);
        var name = document.createElement("div");
        name.id="wishList-name";
        var span = document.createElement('span');
        span.innerHTML=d.Title;
        name.appendChild(span);
        item.appendChild(poster);
        item.appendChild(name);
       // link.appendChild(item);
        containerElement.appendChild(item);
      });
    }); 
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

renderWishList();