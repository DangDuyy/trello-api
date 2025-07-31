import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { BOARD_INVITATION_STATUS, INVITATION_TYPES } from '~/utils/constants'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { boardModel } from './boardModel'
import { userModel } from './userModel'
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
    const validData = await validateBeforeCreate(data)
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
    //goi insert voa db
    const createInvitation = await GET_DB().collection(INVITATION_COLLECTION_NAME).insertOne(newInvitationToAdd)
    return createInvitation
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

const findByUser = async (userId) => {
  try {
    //ben trai la attribute trong schema cua model dang can xet
    const queryConditions = [
      { inviteeId: new ObjectId(userId) },
      { _destroy: false }
    ]
    //aggregate luon luon phai tra ve array
    const results = await GET_DB().collection(INVITATION_COLLECTION_NAME).aggregate([
      { $match: { $and: queryConditions } },
      //lookup: tim ben schema khac
      { $lookup: {
        from: userModel.USER_COLLECTION_NAME,
        //localField: la local cua model dang lam (vd o day la invitationModel)
        localField: 'inviterId',
        foreignField: '_id',
        as: 'inviter',
        //pipeline: loai bo nhung truong khong muon lay trong project
        //sau cac toan tu and, or, pipeline la []
        pipeline: [{ $project: { 'password': 0, 'verifyToken': 0 } }]
      } },
      { $lookup: {
        from: userModel.USER_COLLECTION_NAME,
        localField: 'inviteeId',
        foreignField: '_id',
        as: 'invitee',
        pipeline: [{ $project: { 'password': 0, 'verifyToken': 0 } }]
      } },
      { $lookup: {
        from: boardModel.BOARD_COLLECTION_NAME,
        localField: 'boardInvitation.boardId',
        foreignField: '_id',
        as: 'board'
      } }
    ]).toArray()
    console.log('invitations', results)
    return results
  }
  catch (err) {
    throw new Error(err)
  }
}

export const invitationModel = {
  createNewBoardInvitation,
  findOneById,
  update,
  findByUser
}