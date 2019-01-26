var express = require('express');
var router = express.Router();
const mysql = require("mysql");
const config = require("../config");
const connection = mysql.createConnection(config.db);
connection.connect();
const bcrypt = require("bcrypt-nodejs");
// dont need to include.js because node assumes that this is a js file
// our node module, its in gitignore
const apiBaseUrl = "http://api.themoviedb.org/3";
const imageBaseUrl = "http://image.tmdb.org/t/p/w300";
const nowPlayingUrl = `${apiBaseUrl}/movie/now_playing?api_key=${config.apiKey}`;

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
  const searchURL = `${apiBaseUrl}/search/movie?query=${movieTitle}&api_key=${config.apiKey}`;
  request.get(searchURL, (error,response,body)=>{
    const parsedData = JSON.parse(body);
    res.render("now_playing",{
      imageBaseUrl,
      parsedData : parsedData.results,
    });
  });
});

router.get("/login", (req,res,next)=>{
  res.render("login");
})

router.post("/loginProcess", (req,res,next)=>{
  const insertQuery = ` INSERT into users (email,password)
  VALUES
  (?,?);`;
  // res.json(req.body);
  connection.query(insertQuery, [req.body.email, x], (error, results)=>{
    const x = bcrypt.hashSync(x);
    if(error){
      throw error
    } else{
      res.json("success");
    }
  })
})

module.exports = router;
