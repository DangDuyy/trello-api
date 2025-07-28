/* eslint-disable no-console */
/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */
import { cardService } from '~/services/cardService'
import { StatusCodes } from 'http-status-codes'
const createNew = ( async (req, res, next) => {
  try {
    const createCard = await cardService.createNew(req.body)
    res.status(StatusCodes.CREATED).json(createCard)
  }
  catch (error) {
    next(error)
  }
})
const getDetails = ( async (req, res, next) => {
  try {
    const cardId = req.params.id
    const card = await cardService.getDetails(cardId)

    res.status(StatusCodes.OK).json(card)
  }
  catch (error) {
    next(error)
  }
})

const update = async (req, res, next) => {
  try {
    const cardId = req.params.id
    const cardCoverFile = req.file
    const userInfo = req.jwtDecoded
    const updatedCard = await cardService.update(cardId, req.body, cardCoverFile, userInfo)

    res.status(StatusCodes.OK).json(updatedCard)
  }
  catch (err) {
    next(err)
  }
}

export const cardController = {
  createNew,
  getDetails,
  update
}