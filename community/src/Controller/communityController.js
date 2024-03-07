const CommunityService = require('../Service/communityService')

class CommunityController {
  constructor () {
    this.communityService = new CommunityService()
  }

  async addNewCommunity (req, res) {
    try {
      const token = req.token
      console.log(`token value is ${token}`)

      const community = {
        ownerToken: token,
        name: req.body.name,
        isOwner: false
      }

      const result = await this.communityService.newCommunity(community)

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

      console.log(`Community ID: ${communityId}`)
      console.log(`User ID: ${userId}`)
      console.log(`Username: ${username}`)

      const updatedCommunity = await this.communityService.joinCommunity(communityId, userId, username)
      console.log(`Updated Community: ${JSON.stringify(updatedCommunity)}`)
      res.json(updatedCommunity)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Internal Server Error' })
    }
  }

  async getAllForUser (req, res) {
    try {
      const userId = req.decodedUserId
      const communities = await this.communityService.getAllCommunitiesforuser(userId)
      console.log(`received userId is  : ${userId}`)
      console.log(`received communities are : ${communities}`)

      res.json(communities)
    } catch (err) {
      res.status(400).json({ message: err.message })
    }
  }

/*   async updateCommunity (req, res) {
    try {
      const communityId = req.params.communityId
      const updates = req.body

      // Use your CommunityService to update the community
      const result = await this.communityService.updateCommunity(communityId, updates)

      res.json(result)
    } catch (error) {
      res.status(500).json({ message: 'Failed to update community', error: error.message })
    }
  } */
}

module.exports = CommunityController
