const express = require('express')
const router = express.Router()
const CommunityController = require('../Controller/communityController')
const communityMiddlewares = require('../middlewares/communityMiddleware')

const communityController = new CommunityController()

router.post('/new', communityMiddlewares.userFromToken, communityController.addNewCommunity.bind(communityController))
router.get('/get/:communityId', communityController.findCommunityById.bind(communityController))
router.post('/joinCommunity/:communityId', communityMiddlewares.userFromToken, communityController.joinCommunity.bind(communityController))
router.get('/getallforuser', communityMiddlewares.userFromToken, communityController.getAllForUser.bind(communityController))
/* router.patch('/:communityId', communityController.updateCommunity) */

module.exports = router
