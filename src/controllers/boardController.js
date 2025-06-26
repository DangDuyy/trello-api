/* eslint-disable no-console */
/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const createNew = ( async (req, res, next) => {
  try {
    console.log('req.body ', req.body)
    console.log('req.query ', req.query)
    console.log('req.params ', req.params)
    console.log('req.files ', req.files)
    console.log('req.cookies ', req.cookies)
    console.log('req.jwtDecoded ', req.jwtDecoded)
    //dieu huong du lieu sang tang service

    // throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Bug!!!')
    //co ket qua thi tra ve phia client
    // res.status(StatusCodes.CREATED).json({
    //   message: 'POST from controller: API create new board'
    // })
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