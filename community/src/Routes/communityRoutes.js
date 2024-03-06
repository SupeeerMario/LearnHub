const express = require('express')
const router = express.Router()
const CommunityController = require('../Controller/communityController')
const communityMiddlewares = require('../middlewares/communityMiddleware')

const communityController = new CommunityController()

router.post('/new', communityMiddlewares.readCookie, communityController.addNewCommunity.bind(communityController))
router.get('/get/:communityId', communityController.findCommunityById.bind(communityController))
router.get('/getall', communityController.getAll.bind(communityController))
router.patch('/:communityId', communityController.updateCommunity)

module.exports = router
