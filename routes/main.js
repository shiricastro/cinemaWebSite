var express = require('express');
var router = express.Router();
const usersBL = require('../models/usersBL');

router.get('/',async function(req, res, next) {
  if(req.session.userId){
    let permissions;
    if(!req.session.admin){
      let permissionsData = await usersBL.getUserPermissions(req.session.userId);
      if(permissionsData){ 
        permissions = permissionsData.permissions;
        req.session.permissions = permissions
      }
    }
    
    res.render('main', {admin:req.session.admin,baseUrl:'',permissions:permissions});
  }else{
    res.redirect('/users')
  } 
});



module.exports = router;
