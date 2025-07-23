import Joi from 'joi'
import { EMAIL_RULE, EMAIL_RULE_MESSAGE, PASSWORD_RULE, PASSWORD_RULE_MESSAGE } from '~/utils/validators'

const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    email: Joi.string().required().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE),
    password: Joi.string().required().pattern(PASSWORD_RULE).message(PASSWORD_RULE_MESSAGE)
  })
  try {
    await correctCondition.validateAsync(req.body, {
      abortEarly: false
    })
    next()
  }
  catch (err) {
    next(err)
  }
}

const verifyAccount = async (req, res, next) => {
  const correctCondition = Joi.object({
    email: Joi.string().required().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE),
    token: Joi.string().required()
  })
  try {
    await correctCondition.validateAsync(req.body, {
      abortEarly: false
    })
    next()
  }
  catch (err) {
    next(err)
  }
}

const login = async (req, res, next) => {
  const correctCondition = Joi.object({
    email: Joi.string().required().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE),
    password: Joi.string().required().pattern(PASSWORD_RULE).message(PASSWORD_RULE_MESSAGE)
  })
  try {
    await correctCondition.validateAsync(req.body, {
      abortEarly: false
    })
    next()
  }
  catch (err) {
    next(err)
  }
}

const update = async (req, res, next) => {
  const correctCondition = Joi.object({
    displayName: Joi.string().trim().strict(),
    current_password: Joi.string().pattern(PASSWORD_RULE).message(`current_passord: ${PASSWORD_RULE_MESSAGE}`),
    new_password: Joi.string().pattern(PASSWORD_RULE).message(`new_password: ${PASSWORD_RULE_MESSAGE}`)
  })

  try {
    await correctCondition.validateAsync(req.body, {
      abortEarly: false
    })
    next()
  }
  catch (err) {
    next(err)
  }
}
export const userValidation = {
  createNew,
  verifyAccount,
  login,
  update
}