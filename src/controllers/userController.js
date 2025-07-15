import { StatusCodes } from 'http-status-codes'
import { userService } from '~/services/userService'
const createNew = async (req, res, next) => {
  try {
    const createdUser = await userService.createNew(req.body)
    res.status(StatusCodes.CREATED).json(createdUser)
  }
  catch (err) {
    next(err)
  }
}

const verifyAccount = async (req, res, next) => {
  try {
    const result = await userService.verifyAccount(req.body)
    console.log(result)
    res.status(StatusCodes.OK).json(result)
  }
  catch (err) {
    next (err)
  }
}

const login = async (req, res, next) => {
  try {
    const result = await userService.login(req.body)
    res.status(StatusCodes.OK).json(result)
  }
  catch (err) {
    next(err)
  }
}

export const userController = {
  createNew,
  login,
  verifyAccount
}