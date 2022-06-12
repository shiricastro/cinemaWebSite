var express = require('express');
var router = express.Router();
const subscriptionsBL = require('../models/subscriptionsBL');


router.get('/', async function(req, res, next) {
  let permissions = req.session.permissions;
  let admin = req.session.admin;
  if(admin || permissions && permissions.includes("View Subscriptions") ){ 
    let members = await subscriptionsBL.getMembers();
    let movies = await subscriptionsBL.getMovies();
    res.render('subscriptions',{admin:admin,baseUrl:'subscriptions',path:'subscriptions',members:members,movies:movies,permissions:permissions});
  }else{
    res.redirect('/');
  }
 
});
router.get('/:id', async function(req, res, next) {
  let permissions = req.session.permissions;
  let admin = req.session.admin;
  if(admin || permissions && permissions.includes("View Subscriptions") ){
    let id = req.params.id;
    let members = await subscriptionsBL.getMembers();
    let movies = await subscriptionsBL.getMovies();
    let member =[];
    member.push(members.find(x=>x._id === id));
    res.render('subscriptions',{admin:admin,baseUrl:'subscriptions',path:'',members:member,movies:movies,permissions:permissions});
  }else{
    res.redirect('/');
  }
 
});
router.post('/', async function(req, res, next) {
  let memberId = req.body.memberId;
  let subscriptionId = req.body.subscriptionId;
  let movieId = req.body.movieId;
  let date = req.body.date;
  let subscription = {subscriptionId:subscriptionId,memberId:memberId,movies:[{movieId:movieId,date:date}]}
  let answerArr = await subscriptionsBL.createSubscription(subscription);
  if(answerArr){
    res.redirect('/subscriptions');
  }else{
    res.send('Error');
  }
});

router.get('/createMember',async function(req, res, next) {
  let permissions = req.session.permissions;
  let admin = req.session.admin;
  if(admin || permissions && permissions.includes("Create Subscriptions") ){
    res.render('createMember',{admin:admin,baseUrl:'subscriptions',path:'createMember',permissions:permissions});
  }else{
    res.redirect('/');
  }
  
});
router.post('/createMember', async function(req, res, next) {
  let name = req.body.name;
  let email = req.body.email;
  let city = req.body.city;
  let member = {name:name,email:email,city:city};
  let answerArr = await subscriptionsBL.createMember(member);
  if(answerArr){
     res.redirect('/subscriptions');
  }else{
    res.send('error')
  }
  
});

router.post('/deleteMember/:id', async function(req, res, next) {
    let id = req.params.id;
    let status = await subscriptionsBL.deleteMember(id);
    if(status){
      res.redirect('/subscriptions');
    }else{
      res.send('error')
    }
  
});
router.get('/updateMember/:id',async function(req, res, next) {
  let permissions = req.session.permissions;
  let admin = req.session.admin;
  if(admin || permissions && permissions.includes("Update Subscriptions") ){
      let id = req.params.id;
      let memberDB = await subscriptionsBL.getMemberById(id);
      let member = memberDB.data;
      if(member){
        res.render('updateMember',{admin:admin,baseUrl:'subscriptions',path:'updateMember',member:member});
      }else{
        res.redirect('/subscriptions')
      }  
  }else{
    res.redirect('/');
  }
 
});
router.post('/updateMember',async function(req, res, next) {
      let memberObj = {
        id:req.body.memberId,
        name:req.body.name,
        email:req.body.email,
        city:req.body.city
      }
      let member = await subscriptionsBL.updateMember(memberObj);
      if(member){
        res.redirect('/subscriptions')
      }else{
        res.send('error')
      }  
  
 
});



module.exports = router;
