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
    const userId = req.jwtDecoded._id
    console.log('createNew - userId:', userId, 'body:', req.body)
    const createBoard = await boardService.createNew(userId, req.body)

    //co ket qua thi tra ve phia client
    res.status(StatusCodes.CREATED).json(createBoard)
  }
  catch (error) {
    console.error('createNew error:', error)
    next(error)
  }
})
const getDetails = ( async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const boardId = req.params.id
    const board = await boardService.getDetails(userId, boardId)

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

const moveCardToDifferentColumn = ( async (req, res, next) => {
  try {
    const result = await boardService.moveCardToDifferentColumn(req.body)
    res.status(StatusCodes.OK).json(result)
  }
  catch (err) {
    next(err)
  }
})

const getBoards = async (req, res, next ) => {
  try {
    const userId = req.jwtDecoded._id
    const { page, itemsPerPage } = req.query
    // eslint-disable-next-line no-console
    console.log('getBoards - userId:', userId, 'page:', page, 'itemsPerPage:', itemsPerPage)
    const result = await boardService.getBoards(userId, page, itemsPerPage)
    // eslint-disable-next-line no-console
    console.log('getBoards - result:', result)

    res.status(StatusCodes.OK).json(result)
  }
  catch (err) {
    // eslint-disable-next-line no-console
    console.error('getBoards error:', err)
    next(err)
  }
}

export const boardController = {
  createNew,
  getDetails,
  update,
  moveCardToDifferentColumn,
  getBoards
}