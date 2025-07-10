import Joi from 'joi'
import { GET_DB } from '~/config/mongodb'
import { EMAIL_RULE, EMAIL_RULE_MESSAGE } from '~/utils/validators'
const USER_ROLE = {
  CLIENT: 'CLIENT',
  ADMIN: 'ADMIN'
}
import { ObjectId } from 'mongodb'

const USER_COLLECTION_NAME = 'users'
const USER_COLLECTION_SCHEMA = Joi.object({
  email: Joi.string().required().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE),
  password: Joi.string().required(),
  username: Joi.string().required().trim().strict(),
  displayName: Joi.string().required().trim().strict(),
  avatar: Joi.string().default(null),
  role: Joi.string().valid(USER_ROLE.ADMIN, USER_ROLE.CLIENT).default(USER_ROLE.CLIENT),
  isActive: Joi.boolean().default(false),
  verifyToken: Joi.string(),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

//chi dinh nhung field khong muon cap nhat trong ham update
const INVALID_UPDATE_VALUES = ['_id', 'username', 'createdAt', 'email']

const validateBeforeCreate = async (data) => {
  return await USER_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data)
    const createUser = await GET_DB().collection(USER_COLLECTION_NAME).insertOne(validData)
    return createUser
  }
  catch (err) {
    throw new Error(err)
  }
}

//tim user theo id
const findOneById = async (id) => {
  try {
    const result = await GET_DB().collection(USER_COLLECTION_NAME).findOne({
      _id: new ObjectId(id)
    })
    return result
  }
  catch (err) {
    throw new Error(err)
  }
}

//update user
const update = async (userId, data) => {
  try {
    Object.keys(data).forEach(fieldName => {
      if ((INVALID_UPDATE_VALUES).includes(fieldName))
        delete data[fieldName]
    })
    const result = await GET_DB().collection(USER_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $set: data },
      { returnDocument: 'after' }
    )
    return result || null
  }
  catch (err)
  {
    throw new Error
  }
}

export const userModel = {
  createNew,
  update,
  findOneById,
  USER_COLLECTION_NAME,
  USER_COLLECTION_SCHEMA
}