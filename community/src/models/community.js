const mongoose = require('mongoose')

const CommunitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: false },
    ownerToken: { type: String, required: false, unique: false },
    isOwner: { type: Boolean, required: false, unique: false }
  },
  { timestamps: true }
)

// Remove the existing unique index on the ownerToken field
CommunitySchema.index({ ownerToken: 1 }, { unique: false })

const Community = mongoose.model('Community', CommunitySchema)

module.exports = Community
