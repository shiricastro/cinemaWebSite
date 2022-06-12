var express = require('express');
var router = express.Router();
const usersBL = require('../models/usersBL');

router.get('/',  function(req, res, next) {
  res.render('login',{});
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
router.get('/logout', function(req, res, next) {
  req.session.destroy();
  res.redirect('/users');
});
router.get('/managmentUsers',async function(req, res, next) {
  if(req.session.admin){
    let users = await usersBL.getAllUsers();
    res.render('managmentUsers',{admin:req.session.admin,baseUrl:'users',path:'managmentUsers',users:users});
  }else{
    res.redirect('/users')
  }  

});
router.get('/createUser', function(req, res, next) {
  if(req.session.admin){
    res.render('createUser',{admin:req.session.admin,baseUrl:'users',path:'createUser'});
  }else{
    res.redirect('/users')
  } 
  
});
router.post('/createUser', async function(req, res, next) {
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let username = req.body.username;
  let sessionTimeOut = req.body.sessionTimeOut;
  let permissions=req.body.permissions;
  let user = {firstName:firstName,lastName:lastName,username:username,sessionTimeOut:sessionTimeOut,permissions:permissions};
  let answerArr = await usersBL.createUser(user);
  if(answerArr){
     res.redirect('/users/managmentUsers');
  }else{
    res.send('User Exist')
  }
  
});
router.post('/deleteUser/:id', async function(req, res, next) {
    let id = req.params.id;
    let status = await usersBL.deleteUser(id);
    if(status){
      return status;
    }
  
});
router.get('/updateUser/:id',async function(req, res, next) {
  if(req.session.admin){
      let id = req.params.id;
      let user = await usersBL.getUserById(id);
      if(user){
        res.render('updateUser',{admin:req.session.admin,baseUrl:'users',path:'updateUser',user:user});
      }else{
        res.redirect('/users/managmentUsers')
      }   
  }else{
    res.redirect('/users')
  }  
});
router.post('/updateUser',async function(req, res) {
    let userObj = {
      id:req.body.userId,
      firstName:req.body.firstName,
      lastName:req.body.lastName,
      username:req.body.username,
      sessionTimeOut:req.body.sessionTimeOut,
      created:req.body.created,
      permissions:req.body.permissions      
    }
    let responseUpdate= await usersBL.updateUser(userObj);
    if(responseUpdate){
      res.redirect('/users/managmentUsers');
    }else{
      res.send('The Username is Taken By another user!');
    }
 
});
router.get('/createAccount', function(req, res, next) {
    res.render('createAccount',{});
});
router.post('/createAccount', async function(req, res, next) {
  let username = req.body.username;
  let password = req.body.password;
  let answerArr = await usersBL.createAccount(username,password);
  if(answerArr){
     res.redirect('/');
  }else{
    res.send('User Not Exist')
  }
});



module.exports = router;
