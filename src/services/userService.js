import { StatusCodes } from 'http-status-codes'
import { userModel } from '~/models/userModel'
import ApiError from '~/utils/ApiError'
import bcryptjs from 'bcryptjs'
const createNew = async (reqBody) => {
  try {
    const existUser = await userModel.findOneByEmail(reqBody.email)
    if (existUser) {
      throw new ApiError(StatusCodes.CONFLICT, 'User already exist')
    }
    const nameFromEmail = reqBody.email.split('@')[0]
    const newUser = {
      username: nameFromEmail,
      displayName: nameFromEmail,
      email: reqBody.email,
      verifyToken: uuidv4(),
      password: bcryptjs.hashSync(reqBody.password, 8) //tham so thu 2 la do phuc tap cua thuat toan bam
    }
    const result = await userModel.createNew(newUser)

    const getNewUser = await userModel.findOneById(result.insertedId)

    return getNewUser
  }
  catch (err) {
    throw new Error(err)
  }
}

export const userService = {
  createNew
}