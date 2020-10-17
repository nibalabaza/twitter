exports.init = function (bdd) {
  const express = require('express'),
  router = express.Router(),
  userController = require('../controllers/user').init(bdd);
  let db = require('../model/database');

  router.get('/', userController.getAll);
  
  router.post('/login', userController.login);
  router.post('/register', userController.register);
  router.post('/:id_user/follow', userController.follow)
  router.get('/pseudo/:pseudo', userController.getByPseudo);
  router.get('/follwed/post', userController.allposts);
  router.get('/usersfollowed', userController.usersfollowed)
  return router;
}



