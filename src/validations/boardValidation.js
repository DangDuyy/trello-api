/* eslint-disable no-console */
/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import ApiError from '~/utils/ApiError'
import { BOARD_TYPES } from '~/utils/constants'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
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

const moveCardToDifferentColumn = async (req, res, next) => {
  // console.log('moveCardToDifferentColumn validation - req.body:', req.body)
  const correctCondition = Joi.object({
    currentCardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    prevColumnId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    prevCardOrderIds: Joi.array().items(
      Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
    ).default([]),
    nextColumnId:Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    nextCardOrderIds: Joi.array().items(
      Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
    ).default([])
  })
  try {
    await correctCondition.validateAsync(req.body, {
      abortEarly: false
    })
    next()
  }
  catch (err) {
    console.log('Validation error:', err.message)
    next(err)
  }
}

export const boardValidation = {
  createNew, update, moveCardToDifferentColumn
}