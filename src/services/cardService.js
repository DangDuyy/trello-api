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


export const cardService = {
  createNew,
  getDetails
}