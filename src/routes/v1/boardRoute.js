/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */
import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardValidation } from '~/validations/boardValidation'
import { boardController } from '~/controllers/boardController'

const Router = express.Router()

Router.route('/')
  .get((req, res) => {
    res.status(StatusCodes.OK).json({ message: 'NOTE: API get list boards' })
  })
  .post(boardValidation.createNew, boardController.createNew)


Router.route('/:id')
  .get(boardController.getDetails)
  .put(boardValidation.update, boardController.update)

//API HO TRO CAP NHAT COLUMN KHI CHUYEN CARD SANG CAC COLUMN KHAC NHAU
Router.route('/supports/moving-card')
  .put(boardValidation.moveCardToDifferentColumn, boardController.moveCardToDifferentColumn)
export const boardRoutes = Router