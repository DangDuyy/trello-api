/* eslint-disable no-useless-catch */

/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */
import { StatusCodes } from 'http-status-codes'
import { columnModel } from '~/models/columnModel'
import { boardModel } from '~/models/boardModel'
import ApiError from '~/utils/ApiError'
const createNew = ( async (reqBody) => {
  try {
    const newColumn = {
      ...reqBody
      // slug: slugify(reqBody.title)
    }

    const createColumn = await columnModel.createNew(newColumn)

    const getNewColumn = await columnModel.findOneById(createColumn.insertedId)
    if (getNewColumn) {
      //xu ly cau truc data truoc khi tra ve
      getNewColumn.cards = []

      //cap nhat mang columnOrderIds trong collection Boards
      await boardModel.pushColumnOrderIds(getNewColumn)
    }
    return getNewColumn
  }
  catch (error) {
    throw error
  }
})
const getDetails = ( async (columnId) => {
  try {
    const column = await columnModel.getDetails(columnId)
    if (!column)
      throw new ApiError(StatusCodes.NOT_FOUND, 'no column found')

    return column
  }
  catch (error) {
    throw error
  }
})

const update = ( async (columnId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now
    }

    const updateColumn = await columnModel.update(columnId, updateData)
    return updateColumn
  }
  catch (err) {
    throw err
  }
})


export const columnService = {
  createNew,
  getDetails,
  update
}