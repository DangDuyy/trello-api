/* eslint-disable no-console */
/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */
import { boardService } from '~/services/boardService'
import { StatusCodes } from 'http-status-codes'
const createNew = ( async (req, res, next) => {
  try {
    //dieu huong du lieu sang tang service

    // throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Bug!!!')
    //co ket qua thi tra ve phia client
    const createBoard = await boardService.createNew(req.body)

    //co ket qua thi tra ve phia client
    res.status(StatusCodes.CREATED).json(createBoard)
  }
  catch (error) {
    next(error)
    // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    //   errors: error.message
    // })
  }
})

export const boardController = {
  createNew
}