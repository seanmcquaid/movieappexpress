var express = require('express');
var router = express.Router();
// dont need to include.js because node assumes that this is a js file
// our node module, its in gitignore
const apiKey = require("../config")
const apiBaseUrl = "http://api.themoviedb.org/3";
const imageBaseUrl = "http://image.tmdb.org/t/p/w300";
const nowPlayingUrl = `${apiBaseUrl}/movie/now_playing?api_key=${apiKey}`;

// $.getJSON(url,(data)=>{}) becomes
const request = require("request");

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });
  // looks similar to a JSON call, eh!?!
  request.get(nowPlayingUrl, (error, response, body)=>{
    // every programming language has a parse of some sort
    const parsedData = JSON.parse(body);
    // we now have the data from the movie api, lets send it over to the view/EJS
    // res.json(parsedData);
    res.render("now_playing", {
      parsedData: parsedData.results,
      imageBaseUrl,
    });
  })
});

// make a new route called /search
// if the user comes to it, render search.ejs

router.get("/search", function(req, res, next){
  res.render("search",{
    title: "search!",
  })
});

router.post("/search/movie", (req,res,next)=>{
  // submitted data from forms comes in the req object
  // query string data is in req.query
  // posted data is in req.body
  // res.json(req.body);
  const movieTitle = req.body.movieTitle;
  const searchURL = `${apiBaseUrl}/search/movie?query=${movieTitle}&api_key=${apiKey}`;
  request.get(searchURL, (error,response,body)=>{
    const parsedData = JSON.parse(body);
    res.render("now_playing",{
      imageBaseUrl,
      parsedData : parsedData.results,
    });
  });
});

module.exports = router;
