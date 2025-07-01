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

const update = async (req, res, next) => {
  //luu y: khong dung required() trong truong hop update
  const correctCondition = Joi.object({
    title: Joi.string().min(3).max(50).trim().strict(),
    description: Joi.string().min(3).max(256).trim().strict()
    // type: Joi.string().valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVATE).required()
  })
  try {
    await correctCondition.validateAsync(req.body, {
      abortEarly: false,
      //do cap nhat truong columnOrderIds - chua co trong correctCondition, nen phai cho phep unknown
      allowUnknown: true
    })

    next()
  }
  catch (error) {
    next(new ApiError(StatusCodes.NETWORK_AUTHENTICATION_REQUIRED, new Error(error).message))
  }
}

export const boardValidation = {
  createNew, update
}