/* eslint-disable no-console */
/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */
import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { BOARD_TYPES } from '~/utils/constants'
const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    title: Joi.string().required().min(3).max(50).trim().strict(),
    description: Joi.string().required().min(3).max(256).trim().strict(),
    //validate cho no chi nhan duoc 2 gia tri hop li la private va public
    type: Joi.string().valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVATE).required()
  })
  try {
    //validate du
    //chinh dinh abortEarly: false de truong hop nhieu loi validation thi tra ve tat ca loi
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    //Validate du lieu hop le thi nhay sang tang khac
    next()
  }
  catch (error) {
    next(new ApiError(StatusCodes.NETWORK_AUTHENTICATION_REQUIRED, new Error(error).message))
  }
}

export const boardValidation = {
  createNew
}