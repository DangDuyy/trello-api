/* eslint-disable no-useless-catch */

/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */
import { StatusCodes } from 'http-status-codes'
import { columnModel } from '~/models/columnModel'
import { cardModel } from '~/models/cardModel'
import ApiError from '~/utils/ApiError'
import { CloudinaryProvider } from '~/providers/CloudinaryProvider'
const createNew = ( async (reqBody) => {
  try {
    const newCard = {
      ...reqBody
      // slug: slugify(reqBody.title)
    }

    const createCard = await cardModel.createNew(newCard)

    const getNewCard = await cardModel.findOneById(createCard.insertedId)

    if (getNewCard) {
      await columnModel.pushCardOrderIds(getNewCard)
    }
    return getNewCard
  }
  catch (error) {
    throw error
  }
})
const getDetails = ( async (cardId) => {
  try {
    const card = await cardModel.getDetails(cardId)
    if (!card)
      throw new ApiError(StatusCodes.NOT_FOUND, 'no card found')

    return card
  }
  catch (error) {
    throw error
  }
})

const update = async (cardId, reqBody, cardCoverFile, userInfo) => {
  try {
    const updatedData = {
      ...reqBody,
      updatedAt: Date.now()
    }
    let updatedCard = {}

    if (cardCoverFile) {
      const uploadResult = await CloudinaryProvider.streamUpload(cardCoverFile.buffer, 'card-covers')

      updatedCard = await cardModel.update(cardId, {
        cover: uploadResult.secure_url
      })
    }
    else if (updatedData.commentToAdd) {
      //tao du lieu comment de them vao database, can bo sung them nhung field can thiet
      const commentData = {
        ...updatedData.commentToAdd,
        commentetAt: Date.now(),
        userId: userInfo._id,
        userEmail: userInfo.email
      }
      //unshift === push (first in last out)
      updatedCard = await cardModel.unshiftNewComment(cardId, commentData)
    }
    else
    {
      //cac truong hop update card khong di kem cover
      updatedCard = await cardModel.update(cardId, updatedData)
    }
    return updatedCard
  }
  catch (err) {
    throw new Error(err)
  }
}


export const cardService = {
  createNew,
  getDetails,
  update
}