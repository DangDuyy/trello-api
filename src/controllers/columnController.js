/* eslint-disable no-console */
/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */
import { columnService } from '~/services/columnService'
import { StatusCodes } from 'http-status-codes'
const createNew = ( async (req, res, next) => {
  try {
    const createColumn = await columnService.createNew(req.body)
    res.status(StatusCodes.CREATED).json(createColumn)
  }
  catch (error) {
    next(error)
  }
})
const getDetails = ( async (req, res, next) => {
  try {
    const columnId = req.params.id
    const column = await columnService.getDetails(columnId)

    res.status(StatusCodes.OK).json(column)
  }
  catch (error) {
    next(error)
  }
})

export const columnController = {
  createNew,
  getDetails
}