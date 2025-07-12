import bcryptjs from 'bcryptjs'
import { StatusCodes } from 'http-status-codes'
import { v4 as uuidv4 } from 'uuid'
import { env } from '~/config/environment'
import { userModel } from '~/models/userModel'
import { ResendProvider } from '~/providers/ResendProvider'
import ApiError from '~/utils/ApiError'
import { pickUser } from '~/utils/formatter'
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
      password: bcryptjs.hashSync(reqBody.password, 8)
    }

    const result = await userModel.createNew(newUser)

    const getNewUser = await userModel.findOneById(result.insertedId)

    const verificationLink = `${env.WEBSITE_DOMAIN_DEVELOPMENT}/account/verification?email=${getNewUser.email}&token=${getNewUser.verifyToken}`

    const subject = 'Please verify your email to use services'
    const html = `
      <h3>Here is a verification link!!!</h3>
      <h3>${verificationLink}</h3> `
    const to = getNewUser.email

    const sendEmailResponse = await ResendProvider.sendEmail({ to, subject, html })
    console.log('Send email successfully ', sendEmailResponse)

    return pickUser(getNewUser)
  }
  catch (err) {
    throw new Error(err)
  }
}

export const userService = {
  createNew
}