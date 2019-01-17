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

module.exports = router;
