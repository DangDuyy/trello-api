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
const getDetails = ( async (req, res, next) => {
  try {
    const boardId = req.params.id
    const board = await boardService.getDetails(boardId)

    //co ket qua thi tra ve phia client
    res.status(StatusCodes.OK).json(board)
  }
  catch (error) {
    next(error)
    // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    //   errors: error.message
    // })
  }
})
const update = ( async (req, res, next) => {
  try {
    const boardId = req.params.id
    const updateBoard = await boardService.update(boardId, req.body)

    res.status(StatusCodes.OK).json(updateBoard)
  }
  catch (error) {
    next(error)
  }
})

export const boardController = {
  createNew,
  getDetails,
  update
}