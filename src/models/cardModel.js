/* eslint-disable no-console */
import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
//ten table trong db
const CARD_COLLECTION_NAME = 'cards'
const CARD_COLLECTION_SCHEMA = Joi.object({
  boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  columnId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),

  title: Joi.string().required().min(3).max(50).trim().strict(),
  description: Joi.string().optional(),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(null)
})
const validateBeforeCreate = (async (data) => {
  const result = await CARD_COLLECTION_SCHEMA.validateAsync(data, { abortEarly:false })
  return result
})

const INVALID_UPDATE_FIELDS = ['_id', 'createdAt']
//tao record moi
const createNew = (async (data) => {
  try {
    const validData = await validateBeforeCreate(data)
    //convert boardId va ColumnId tu string sang object
    const newCardToAdd = {
      ...validData,
      boardId: new ObjectId(validData.boardId),
      columnId: new ObjectId(validData.columnId)
    }
    console.log('Valid Data: ', validData)
    const createColumn = await GET_DB().collection(CARD_COLLECTION_NAME).insertOne(newCardToAdd)
    return createColumn
  }
  catch (error) {
    //throw new de co stacktrace
    throw new Error(error)
  }
})

//tim record by id
const findOneById = (async (id) => {
  try {
    const result = await GET_DB().collection(CARD_COLLECTION_NAME).findOne({
      _id: new ObjectId(id)
    })
    return result
  }
  catch (error) {
    throw new Error(error)
  }
})

const update = async (cardId, updateData) => {
  try {
    Object.keys(updateData).forEach(fieldName => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName))
        delete updateData[fieldName]
    })
    if (updateData.columnId) updateData.columnId = new ObjectId(updateData.columnId)
    const result = await GET_DB().collection(CARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(cardId) },
      { $set: updateData },
      { returnDocument: 'after' }
    )
    return result || null
  }
  catch (err) {
    throw new Error(err)
  }
}

const deleteManyByColumnId = async (columnId) => {
  try {
    const result = await GET_DB().collection(CARD_COLLECTION_NAME).deleteMany(
      { columnId: new ObjectId(columnId) }
    )
    return result || null
  }
  catch (err) {
    throw new Error(err)
  }
}

// const getDetails = (async (boardId) => {
//   try {
//     //query tong hop cua mongodb
//     const result = await GET_DB().collection(CARD_COLLECTION_NAME).aggregate([
//       //match: tim dung record co id giong nhau va chua bi destroy
//       { $match: {
//         _id: new ObjectId(boardId),
//         _destroy: false
//       } },
//       //lookup: tim kiem
//       { $lookup: {
//         from: columnModel.CARD_COLLECTION_NAME,
//         //id trong model hien tai
//         localField: '_id',
//         //khoa ngoai tro den bang can join
//         foreignField: 'boardId',
//         as: 'columns'
//       } },
//       { $lookup: {
//         from: cardModel.CARD_COLLECTION_NAME,
//         //id trong model hien tai
//         localField: '_id',
//         //khoa ngoai tro den bang can join
//         foreignField: 'boardId',
//         as: 'cards'
//       } }
//     ]).toArray()
//     console.log(result)

//     //neu co du lieu tra ve board o index 0 , nguoc laij tra ve null
//     return result[0] || null
//   }
//   catch (error) {
//     throw new Error(error)
//   }
// })

export const cardModel = {
  CARD_COLLECTION_NAME,
  CARD_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  update,
  deleteManyByColumnId
}