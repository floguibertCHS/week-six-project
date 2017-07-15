const express = require('express');
const router = express.Router();
const models = require("../models")
const moment = require('moment');
moment().format('MMMM Do YYYY, h:mm:ss a');
//<---------- VIEW ALL GABS ------------->//
router.get("/allGabs", (request, response) =>{
    if(request.session.isAuthenticated === true)
        {
  var gabs = models.message.all({
    order: [['createdAt', 'DESC']],
    include: [models.user, models.like]
  }).then(function (gabs) {
    response.render("allGabs", {gabs: gabs, user: request.session.author});
  });
        } else {
    response.redirect('/login')        
        }
});
/////////////////////////////////////////
router.post('/allGabs', (request, response) => {
    response.render('allGabs');

});
//<---------- CREATE NEW GAB ------------->//
router.get('/newGab', (request, response) => {
    response.render('newGab');
});

router.post('/newGab', (request, response) => {
    var message = {
        content: request.body.content,
        userId: request.session.userId,
        author: request.session.author,
        timestamp:  moment().format("dddd, MMMM Do YYYY, h:mm a"),
 
    }
    models.message.create(message);

    response.redirect('/allGabs');
});

//<---------- ADD A LIKE ------------->//
router.post('/allGabs/:id/like', async(request, response) => {
    var messageId = request.params.id;
    var userId = request.session.userId;
    var username = request.session.author;
    var like = await models.like.find({ where: { messageId: messageId, userId: userId } });

    if (!like) {
        var newLike = await models.like.create({ messageId: messageId, userId: userId, username: username });
    }
    response.redirect('/allGabs');
});
//<---------- VIEW LIKES ------------->//
router.get('/allGabs/:id/like', async(request, response) => { 
    var messageId = parseInt(request.params.id);
    var userId = request.session.userId;
    var likes = await models.like.findAll({ where: { messageId: messageId}});
    var message = await models.message.findById(messageId);
console.log(likes)
    response.render('oneGab', {
        content: message.content, 
        likes:likes,
        author: message.author, 
        user: request.session.author, 
        timestamp: message.timestamp,
        id: messageId

    });
});
//<---------- DELETE GAB AND LIKE ------------->//

router.post('/delete/:id', async (request, response) => {
    var gabId = request.params.id;
    var deleteLikes = await models.like.destroy({
        where: {
            messageId: gabId
        }
    });
    var deleteGab = await models.message.destroy({
        where: {
            id: gabId
        }
    });
        response.redirect('/allGabs');

});
module.exports = router;

