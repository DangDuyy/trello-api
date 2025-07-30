import Joi from 'joi'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { INVITATION_TYPES } from '~/utils/constants'
import { BOARD_INVITATION_STATUS } from '~/utils/constants'
import { ObjectId } from 'mongodb'
import { create } from 'lodash'
import { GET_DB } from '~/config/mongodb'
//define collection (name and schema)
const INVITATION_COLLECTION_NAME = 'invitations'
const INVITATION_COLLECTION_SCHEMA = Joi.object({
  inviterId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  inviteeId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  type: Joi.string().required().valid(...Object.values(INVITATION_TYPES)),
  //vi loi moi la board nen se luu them boardinvitation - optional
  boardInvitation: Joi.object({
    boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    status: Joi.string().required().valid(...Object.values(BOARD_INVITATION_STATUS))
  }).optional(),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

//chi dinh ra nhung field ma chung ta khong cho phep cap nhat trong ham update()
const INVALID_UPDATE_FIELDS = ['_id', 'inviterId', 'inviteeId', 'type', 'createdAt']

const validateBeforeCreate = async (data) => {
  return await INVITATION_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNewBoardInvitation = async (data) => {
  try {
    const validData = validateBeforeCreate(data)
    //covert tu id sang objectId cho chuan
    let newInvitationToAdd = {
      ...validData,
      inviterId: new ObjectId(validData.inviterId),
      inviteeId: new ObjectId(validData.inviteeId)
    }
    //neu ton tai du lieu trong boardInvitation thi update cho cai boardId (nghia la invitation nay la board)
    if (validData.boardInvitation) {
      newInvitationToAdd.boardInvitation = {
        ...validData.boardInvitation,
        boardId: new ObjectId(validData.boardInvitation.boardId)
      }
    }
    return newInvitationToAdd
  }
  catch (err)
  {
    throw new Error(err)
  }
}

const findOneById = async (invitationId) => {
  try {
    const data = await GET_DB().collection(INVITATION_COLLECTION_NAME).findOne(
      { _id: new ObjectId(invitationId) }
    )
    return data
  }
  catch (err) {
    throw new Error(err)
  }
}

const update = async (invitationId, updateData) => {
  try {
    //loc nhung field khong muon update
    Object.keys(updateData).forEach(fieldName => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
        delete updateData[fieldName]
      }
    })
    //doi voi nhung du lieu lien quan den objectId, bien doi o day
    if (updateData.boardInvitation) {
      updateData.boardInvitation = {
        ...updateData.boardInvitation,
        boardId: new ObjectId(updateData.boardInvitation.boardId)
      }
    }
    const result = await GET_DB().collection(INVITATION_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(invitationId) },
      { $set: updateData },
      { returnDocument: 'after' }
    )
    return result
  }
  catch (err) {
    throw new Error(err)
  }
}
export const invitationModel = {
  createNewBoardInvitation,
  findOneById,
  update
}