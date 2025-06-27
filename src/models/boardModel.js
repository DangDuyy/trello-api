/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */
import Joi from 'joi'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { GET_DB } from '~/config/mongodb'
import { ObjectId } from 'mongodb'
//define name and schema
const BOARD_COLLECTION_NAME = 'boards'

//joi khong chi co tac dung validation ma con co tac dung tao schema
const BOARD_COLLECTION_SCHEMA = Joi.object({
  title: Joi.string().required().min(3).max(50).trim().strict(),
  slug: Joi.string().required().min(3).trim().strict(),
  description: Joi.string().required().min(5).max(255).trim().strict(),
  // Lưu ý các item trong mảng columnOrderIds là ObjectId nên cần thêm pattern cho chuẩn nhé, (lúc quay video số 57 mình quên nhưng sang đầu video số 58 sẽ có nhắc lại về cái này.)
  columnOrderIds: Joi.array().items(
    Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  ).default([]),
  createdAt: Joi.date().timestamp('javascript').default('Date.now'),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  //kiem tra xem record da duoc xoa hay chua
  _destroy: Joi.boolean().default(false)
})

const validateBeforeCreate = (async (data) => {
  const result = await BOARD_COLLECTION_SCHEMA.validateAsync(data, {abortEarly:false})
  return result
})

//tao record moi
const createNew = (async (data) => {
  try {
    const validData = await validateBeforeCreate(data)
    console.log('Valid Data: ', validData)
    const createBoard = await GET_DB().collection(BOARD_COLLECTION_NAME).insertOne(validData)
    return createBoard
  }
  catch (error) {
    //throw new de co stacktrace
    throw new Error(error)
  }
})

//tim record by id
const findOneById = (async (id) => {
  try {
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOne({
      _id: new ObjectId(id)
    })
    return result
  }
  catch (error) {
    throw new Error(error)
  }
})

export const boardModel = {
  BOARD_COLLECTION_NAME,
  BOARD_COLLECTION_SCHEMA,
  createNew,
  findOneById
}
