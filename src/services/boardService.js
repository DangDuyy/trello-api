/* eslint-disable no-useless-catch */

/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */
import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'
import { columnModel } from '~/models/columnModel'
import { cardModel } from '~/models/cardModel'
import { boardModel } from '~/models/boardModel'
import ApiError from '~/utils/ApiError'
import { slugify } from '~/utils/formatter'
import { DEFAULT_ITEM_PER_PAGE, DEFAULT_PAGE } from '~/utils/constants'

const createNew = ( async (userId, reqBody) => {
  try {
    //xu ly logic du lieu tuy dac thu du an
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title)
    }

    const createBoard = await boardModel.createNew(userId, newBoard)

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
const getDetails = ( async (userId, boardId) => {
  try {
    const board = await boardModel.getDetails(userId, boardId)
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
const update = ( async (boardId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }
    const updatedBoard = await boardModel.update(boardId, updateData)
    return updatedBoard
  }
  catch (error) {
    throw error
  }
})

const moveCardToDifferentColumn = async (reqBody) => {
  try {
    // eslint-disable-next-line no-console
    console.log('boardService - moveCardToDifferentColumn:', reqBody)

    //cap nhat lai column cu, sau khi lay card ra
    await columnModel.update(reqBody.prevColumnId, {
      cardOrderIds: reqBody.prevCardOrderIds || [],
      updatedAt: Date.now()
    })

    //cap nhat lai column moi, sau khi keo card vao
    await columnModel.update(reqBody.nextColumnId, {
      cardOrderIds: reqBody.nextCardOrderIds || [],
      updatedAt: Date.now()
    })
    //cap nhat lai truong columnId cua card sau khi keo
    await cardModel.update(reqBody.currentCardId, {
      columnId: reqBody.nextColumnId,
      updatedAt: Date.now()
    })

    return { updateResult: 'successfully' }
  }
  catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error in moveCardToDifferentColumn:', err)
    throw err
  }
}
const getBoards = async (userId, page, itemsPerPage) => {
  try {
    //neu khong ton tai page hoac itemsPerPage tu phia FE thi BE se can phai luon gan gia tri mac dinh
    if (!page) page = DEFAULT_PAGE
    if (!itemsPerPage) itemsPerPage = DEFAULT_ITEM_PER_PAGE

    const result = await boardModel.getBoards( userId, parseInt(page, 10), parseInt(itemsPerPage, 10))

    return result
  }
  catch (err) {
    throw new Error(err)
  }
}
export const boardService = {
  createNew,
  getDetails,
  update,
  moveCardToDifferentColumn,
  getBoards
}