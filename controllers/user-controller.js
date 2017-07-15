const express = require('express');
const router = express.Router();
const models = require("../models")
const usermodel = require("../models/user");
const session = require('express-session');

router.use(session({
	secret: "secret_code_gabble",
	resave: false,
	saveUninitialized: true,
}))
//<---------- SIGNUP ------------->//
router.get('/signup', (request, response) => {
        response.render('signup');
})
router.post('/signup', (request, response) => {
    var user = {
        username: request.body.username,
        password: request.body.password,
        displayname: request.body.displayname
    }
    models.user.create(user);
    request.session.isAuthenticated = true;
    request.session.author = request.body.displayname;



    response.redirect('/login');
});
//<---------- LOGIN ------------->//
router.get('/login', (request, response) => {
    response.render('login');
});
router.post('/login', async (request, response) => {

   var user = await models.user.findOne({
        where: {
           username: request.body.username,
            password: request.body.password
        }
    })
    if (!user) {
        response.render('login');
    } else {
        request.session.author = user.displayname; 
        request.session.isAuthenticated = true;
        request.session.userId = user.id;
        console.log('this is the session userId:',request.session.userId);

    response.redirect('/allGabs');
    }
});

//<---------- LOGOUT ------------->//
router.get('/logout', (request, response) => {
    request.session.destroy();
    response.redirect('/');
});

module.exports = router;