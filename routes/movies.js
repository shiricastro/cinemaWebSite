const e = require('express');
var express = require('express');
var router = express.Router();
const moviesBL = require('../models/moviesBL');
const usersBL = require('../models/usersBL');

router.get('/', async function(req, res, next) {
  let permissions = req.session.permissions;
  let admin = req.session.admin;
  if(admin || permissions && permissions.includes("View Movies") ){
    let movies = await moviesBL.getMovies();
    if(req.query.movie){
      let movie = req.query.movie;
      movies = movies.filter(x=>{
        return x.name.toLowerCase().includes(movie.toLowerCase())
      })
    }
    res.render('movies',{admin:admin,baseUrl:'movies',path:'movies',movies:movies,permissions:permissions});
  }else{
    res.redirect('/');
  }
});
router.get('/:id', async function(req, res, next) {
  let permissions = req.session.permissions;
  let admin = req.session.admin;
  if(admin || permissions && permissions.includes("View Movies") ){
    let id = req.params.id;
    let movies = await moviesBL.getMovies();
    let movie=[];
    movie.push(movies.find(x=>x._id == id));
    if(movie){
      res.render('movies',{admin:admin,baseUrl:'movies',path:'',movies:movie,permissions:permissions});
    }else{
      res.redirect('/');
    }
  }else{
    res.redirect('/');
  }
 
});
router.post('/', async function(req, res, next) {
  let username = req.body.username;
  let password = req.body.password;
  let answerArr = await usersBL.cheackLoginData(username,password);
  if(answerArr){
    let answer = answerArr[0];
    let userId = answer._id.toString();
    req.session.userId = userId;
    req.session.admin = (username == 'admin') ? true : false;
    res.redirect('/');
  }else{
    res.send('Invalid User!');
  }
});

router.get('/createMovie',async function(req, res, next) {
  let permissions = req.session.permissions;
  let admin = req.session.admin;
  if(admin || permissions && permissions.includes("Create Movies") ){
    res.render('createMovie',{admin:admin,baseUrl:'movies',path:'createMovie',permissions:permissions});
  }else{
    res.redirect('/');
  }
  
});
router.post('/createMovie', async function(req, res, next) {
  let name = req.body.name;
  let genres = req.body.genres;
  let genresArr = genres.split(",");
  let image = req.body.image;
  let premiered = req.body.premiered;
  let movie = {name:name,genres:genresArr,image:image,premiered:premiered};
  let answerArr = await moviesBL.createMovie(movie);
  if(answerArr){
     res.redirect('/movies');
  }else{
    res.send('error')
  }
  
});
router.post('/deleteMovie/:id', async function(req, res, next) {
    let id = req.params.id;
    let status = await moviesBL.deleteMovie(id);
    if(status){
      res.redirect('/movies');
   }else{
     res.send('error')
   }
  
});
router.get('/updateMovie/:id',async function(req, res, next) {
  let permissions = req.session.permissions;
  let admin = req.session.admin;
  if(admin || permissions && permissions.includes("Update Movies") ){
    let id = req.params.id;
    let movie = await moviesBL.getMovieById(id);
    if(movie){    
      res.render('updateMovie',{admin:admin,baseUrl:'movies',path:'movies',movie:movie,permissions:permissions});
    }
  }else{
    res.redirect('/');
  }
 
});
router.post('/updateMovie', async function(req, res, next) {
  let id = req.body.movieId;
  let name = req.body.name;
  let genres = req.body.genres;
  let genresArr = genres.split(",");
  let image = req.body.image;
  let premiered = req.body.premiered;
  let movie = {name:name,genres:genresArr,image:image,premiered:premiered};

  let answerArr = await moviesBL.updateMovie(id,movie);
  if(answerArr){
     res.redirect('/movies');
  }else{
    res.send('error')
  }

});


module.exports = router;
