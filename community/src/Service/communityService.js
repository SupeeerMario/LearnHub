const CommunityRepository = require('../Repository/communityRepository')
const joi = require('joi')

class CommunityService {
  constructor () {
    this.communityRepository = new CommunityRepository()
  }

  validateCommunityData (data) {
    const schema = joi.object({
      name: joi.string().required().label('Name'),
      ownerID: joi.string().label('ownerID'),
      isOwner: joi.boolean().label('isOwner'),
      members: joi.array().label('members')
    })
    return schema.validate(data)
  }

  async newCommunity (communityData) {
    try {
      const { error } = this.validateCommunityData(communityData)
      if (error) {
        throw new Error(error.details[0].message)
      }

      const newCommunity = await this.communityRepository.createCommunity({
        ...communityData,
        members: communityData.members || []
      })

      return { message: 'Community created successfully', community: newCommunity }
    } catch (error) {
      throw new Error(`Community creation failed: ${error.message}`)
    }
  }

  async getCommunityById (_id) {
    try {
      const community = await this.communityRepository.findCommunityById(_id)
      return community
    } catch (error) {
      throw new Error(`Failed to fetch user: ${error.message}`)
    }
  }

  async joinCommunity (communityId, userId, username) {
    try {
      const community = await this.communityRepository.joinCommunity(communityId, userId, username)
      return community
    } catch (error) {
      throw new Error(`Failed to join community: ${error.message}`)
    }
  }

  async getAllCommunitiesforuser (userId) {
    try {
      const communities = await this.communityRepository.allCommunitiesforuser(userId)
      console.log(`received communities are : ${communities}`)

      return communities
    } catch (error) {
      throw new Error(`Failed to fetch communities: ${error.message}`)
    }
  }

  async updateIsOwner (_id, userId) {
    try {
      const community = await this.communityRepository.updateUserRole(_id, userId)
      const communityDataIDPromise = this.getCommunityById(_id)

      // Wait for the Promise to resolve
      const communityOwnerID = await communityDataIDPromise
      let isOwner = false

      console.log(`communityOwnerID.ownerID: ${communityOwnerID.ownerID}`)
      console.log(`userId: ${userId}`)

      if (communityOwnerID.ownerID === userId) {
        isOwner = true
      }

      console.log(`isOwner value: ${isOwner}`)

      return [community, isOwner]
    } catch (error) {
      throw new Error(`Failed to update community: ${error.message}`)
    }
  }
}

module.exports = CommunityService
