/* eslint-disable no-useless-catch */

/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */
import { StatusCodes } from 'http-status-codes'
import { columnModel } from '~/models/columnModel'
import ApiError from '~/utils/ApiError'
const createNew = ( async (reqBody) => {
  try {
    const newColumn = {
      ...reqBody
      // slug: slugify(reqBody.title)
    }

    const createColumn = await columnModel.createNew(newColumn)

    const getNewColumn = await columnModel.findOneById(createColumn.insertedId)

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


export const columnService = {
  createNew,
  getDetails
}