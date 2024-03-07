const Community = require('../models/community')
const mongoose = require('mongoose')

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

  async joinCommunity (communityId, userId, username) {
    try {
      const community = await Community.findById(communityId)
      if (!community) {
        throw new Error('Community not found')
      }

      const isMember = community.members.some((member) => member._id.toString() === userId)

      if (isMember) {
        throw new Error('User is already a member of this community')
      }

      community.members.push({ _id: userId, username })
      await community.save()

      return community.toObject()
    } catch (error) {
      throw new Error(`Failed to join community: ${error.message}`)
    }
  }

  async allCommunitiesforuser (userId) {
    try {
      const userIdObject = new mongoose.Types.ObjectId(userId)
      const communities = await Community.find({ 'members._id': userIdObject }).lean()
      console.log(`received communities are : ${communities}`)
      return communities
    } catch (error) {
      throw new Error(`Failed to fetch communities: ${error.message}`)
    }
  }
}

module.exports = CommunityRepository
