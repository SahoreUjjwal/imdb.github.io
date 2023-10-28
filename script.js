import {API_KEY,IMBD_ID,BASE_URL} from './config.js';

let favourites = [];
//global variable needed to access suggestion list results 
var res={};
var searchList = document.createElement("div");
searchList.id="list-container";

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
        res = await response.json();
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

//function to render wishlist
var renderMovieList=function(){
  console.log(res.Search);
  let containerElement = document.getElementById("wishlist-container");
  containerElement.innerHTML="";
  res.Search.forEach((d)=>{
      console.log(d);
      let containerElement = document.getElementById("wishlist-container");
      var link =document.createElement("a");
      link.href=`movie.html?id=${d.imdbID}`;
      link.className="link-list";
      var item=document.createElement("div");
      item.id="wishlist-item";
      var poster = document.createElement("div");
      poster.id="wishlist-poster";
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
      link.appendChild(item);
     // link.appendChild(item);
      containerElement.appendChild(link);
    });
}





var inputElement = document.getElementById("input-area");
inputElement.addEventListener("input",renderList);          
inputElement.addEventListener("keypress",(event)=>{if(event.key=="Enter")
                {
                  event.preventDefault(); 
                  renderMovieList();
                  toggleList();
                }});
//toggle function to hide the suggestion list
var toggleList = function(){
  var cont=document.getElementById("list-container");
  if(cont!=null)
  {
    cont.style.display='none';  
  }
  
}
//event listener to hide list
document.querySelector("body").addEventListener("click",toggleList);

//listener to show list on click on input box
document.getElementById("input-area").addEventListener("click",(event)=>{
                  let c =document.getElementById("list-container");
                  
                  if(c!=null)
                  {
                  
                    c.style.display='block';
                    event.stopPropagation();
                  }
});
