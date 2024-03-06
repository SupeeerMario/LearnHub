const Community = require('../models/community')

class CommunityRepository {
  async createCommunity (communityData) {
    const newCommunity = await Community.create(communityData)
    return newCommunity.toObject()
  }

  async findCommunityById (_id) {
    try {
      const community = await Community.findById(_id).lean()
      return community
    } catch (error) {
      throw new Error(`Failed to fetch communityData: ${error.message}`)
    }
  }

  async allCommunities () {
    try {
      const communities = await Community.find().lean()
      return communities
    } catch (error) {
      throw new Error(`Failed to fetch communities: ${error.message}`)
    }
  }
}

module.exports = CommunityRepository
