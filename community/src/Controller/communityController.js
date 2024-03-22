const CommunityService = require('../Service/communityService')

class CommunityController {
  constructor () {
    this.communityService = new CommunityService()
  }

  async addNewCommunity (req, res) {
    try {
      const userId = req.decodedUserId
      const userName = req.username

      const community = {
        ownerID: userId,
        name: req.body.name,
        isOwner: true,
        members: [{
          _id: userId,
          username: userName
        }]
      }
      console.log(`community data: ${JSON.stringify(community)}`)
      const result = await this.communityService.newCommunity(community)
      console.log(`ownerID : ${community.ownerID}`)
      res.json(result)
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  }

  async findCommunityById (req, res) {
    try {
      const communityId = req.params.communityId
      console.log(`Community ID: ${communityId}`)

      const community = await this.communityService.getCommunityById(communityId)
      console.log('Fetched Community:', community)

      res.json(community)
    } catch (err) {
      res.status(400).json({ message: err.message })
    }
  }

  async joinCommunity (req, res) {
    try {
      const communityId = req.params.communityId
      const userId = req.decodedUserId
      const username = req.username
      let isOwner = false

      console.log(`Community ID: ${communityId}`)
      console.log(`User ID: ${userId}`)
      console.log(`Username: ${username}`)

      const updatedCommunity = await this.communityService.joinCommunity(communityId, userId, username)
      console.log(`Updated Community: ${JSON.stringify(updatedCommunity)}`)

      if (updatedCommunity.ownerID === userId) {
        isOwner = true
      }

      res.json({ ...updatedCommunity, isOwner }) // Send isOwner as part of the response
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Internal Server Error' })
    }
  }

  async getAllForUser (req, res) {
    try {
      const userId = req.decodedUserId
      const communities = await this.communityService.getAllCommunitiesforuser(userId)

      const updatedCommunities = []

      for (const community of communities) {
        const [updatedCommunity, isOwner] = await this.communityService.updateIsOwner(community._id, userId)
        updatedCommunities.push({ ...updatedCommunity.toObject(), isOwner })
      }

      res.json({ communities: updatedCommunities })
    } catch (err) {
      res.status(400).json({ message: err.message })
    }
  }
}

module.exports = CommunityController
