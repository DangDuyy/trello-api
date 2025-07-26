/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */
import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardRoutes } from './boardRoute'
import { cardRoutes } from './cardRoute'
import { columnRoutes } from './columnRoute'
import { userRoutes } from './userRoute'
const Router = express.Router()

Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ message: 'APIs V1 are ready to use. ', code: StatusCodes.OK })
})

Router.use('/boards', boardRoutes)
//create new cart
Router.use('/cards', cardRoutes)
//create new column
Router.use('/columns', columnRoutes)
//use
Router.use('/users', userRoutes)
export const APIs_V1 = Router