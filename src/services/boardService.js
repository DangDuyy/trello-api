/* eslint-disable no-useless-catch */

/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */
import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'
import { boardModel } from '~/models/boardModel'
import ApiError from '~/utils/ApiError'
import { slugify } from '~/utils/formatter'
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
    //deepclone tao ra cai moi de xu li, ma khong anh huong den board ban dau, tuy muc dich ve sau ma co nen clonedeep hay khong
    const resBoard = cloneDeep(board)
    //dua card ve column dung cua no
    resBoard.columns.forEach(column => {
      //do id trong cac schema dang objectId, nen phai chuyen sang toString de chuyen sang objectId de so sanh
      // column.cards = resBoard.cards.filter(card => card.columnId.toString() === column._id.toString() )
      //cach 2
      column.cards = resBoard.cards.filter(card => card.columnId.equals(column._id) )
    })

    //xoa card cung cap voi column trong schema board
    delete resBoard.cards
    return resBoard
  }
  catch (error) {
    throw error
  }
})


export const boardService = {
  createNew,
  getDetails
}