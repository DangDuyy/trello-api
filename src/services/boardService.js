/* eslint-disable no-useless-catch */

/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */
import { slugify } from '~/utils/formatter'
import { boardModel } from '~/models/boardModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
const createNew = ( async (reqBody) => {
  try {
    //xu ly logic du lieu tuy dac thu du an
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title)
    }

    const createBoard = await boardModel.createNew(newBoard)

    //lay ban ghi board sau khi goi (tuy muc dich du an co can hay khong)
    const getNewBoard = await boardModel.findOneById(createBoard.insertedId)
    //truyen du lieu san tang model de xu ly luu record vao database
    //lam them cac xu ly logic khac voi collection khac tuy dac thu cua du an...vv
    //ban email, notification ve cho admin khi co 1 cai board moi duoc tao

    //tra ket qua ve cho controller
    //trong service luon phai co return
    return getNewBoard
  }
  catch (error) {
    throw error
  }
})
const getDetails = ( async (boardId) => {
  try {
    const board = await boardModel.getDetails(boardId)
    if (!board)
      throw new ApiError(StatusCodes.NOT_FOUND, 'no board found')
    return board
  }
  catch (error) {
    throw error
  }
})


export const boardService = {
  createNew,
  getDetails
}