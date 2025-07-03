/* eslint-disable no-console */
import Joi from 'joi'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
//define collection (name & schema)
//ten table trong db
const COLUMN_COLLECTION_NAME = 'columns'
const COLUMN_COLLECTION_SCHEMA = Joi.object({
  boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  title: Joi.string().required().min(3).max(50).trim().strict(),
  // Lưu ý các item trong mảng cardOrderIds là ObjectId nên cần thêm pattern cho chuẩn nhé, (lúc quay video số 57 mình quên nhưng sang đầu video số 58 sẽ có nhắc lại về cái này.)
  cardOrderIds: Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)).default([]),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)

})

const INVALID_UPDATE_VALUES = ['_id', 'createdAt']

const validateBeforeCreate = (async (data) => {
  const result = await COLUMN_COLLECTION_SCHEMA.validateAsync(data, { abortEarly:false })
  return result
})

//tao record moi
const createNew = (async (data) => {
  try {
    const validData = await validateBeforeCreate(data)
    //convert tu boardId kieu string sang objectId
    const newColumnToAdd = {
      ...validData,
      boardId: new ObjectId(validData.boardId)
    }
    console.log('Valid Data: ', validData)
    const createColumn = await GET_DB().collection(COLUMN_COLLECTION_NAME).insertOne(newColumnToAdd)
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
    const result = await GET_DB().collection(COLUMN_COLLECTION_NAME).findOne({
      _id: new ObjectId(id)
    })
    return result
  }
  catch (error) {
    throw new Error(error)
  }
})

const pushCardOrderIds = ( async (card) => {
  try {
    const result = await GET_DB().collection(COLUMN_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(card.columnId) },
      { $push: { cardOrderIds: new ObjectId (card._id) } },
      { returnDocument: 'after' }
    )
    return result || null
  }
  catch (error) {
    throw new Error(error)
  }
})

const update = async (columnId, updateData) => {
  try {
    Object.keys(updateData).forEach( fieldName => {
      if (INVALID_UPDATE_VALUES.includes(fieldName))
        delete updateData[fieldName]
    })
    const result = await GET_DB().collection(COLUMN_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(columnId) },
      { $set: updateData },
      { returnDocument: 'after' }
    )
    return result || null
  }
  catch (err) {
    throw new Error(err)
  }
}
const deleteOneById = async (columnId) => {
  try {
    const result = await GET_DB().collection(COLUMN_COLLECTION_NAME).deleteOne(
      { _id: new ObjectId(columnId) }
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
//     const result = await GET_DB().collection(COLUMN_COLLECTION_NAME).aggregate([
//       //match: tim dung record co id giong nhau va chua bi destroy
//       { $match: {
//         _id: new ObjectId(boardId),
//         _destroy: false
//       } },
//       //lookup: tim kiem
//       { $lookup: {
//         from: columnModel.COLUMN_COLLECTION_NAME,
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

export const columnModel = {
  COLUMN_COLLECTION_NAME,
  COLUMN_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  pushCardOrderIds,
  update,
  deleteOneById
  // getDetails
}