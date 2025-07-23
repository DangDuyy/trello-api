import bcryptjs from 'bcryptjs'
import { StatusCodes } from 'http-status-codes'
import { v4 as uuidv4 } from 'uuid'
import { env } from '~/config/environment'
import { userModel } from '~/models/userModel'
import { JwtProvider } from '~/providers/JwtProvider'
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

    await ResendProvider.sendEmail({ to, subject, html })

    return pickUser(getNewUser)
  }
  catch (err) {
    throw new Error(err)
  }
}

const verifyAccount = async (reqBody) => {
  try {
    //query user trong database
    const existUser = await userModel.findOneByEmail(reqBody.email)

    //kiem tra user ton tai
    if (!existUser) throw ApiError(StatusCodes.NOT_FOUND, 'Account not found')
    //kiem tra user da duoc kich hoat
    if (existUser.isActive) throw ApiError(StatusCodes.NOT_ACCEPTABLE, 'Account is already active')
    if (reqBody.token !== existUser.verifyToken) throw ApiError(StatusCodes.NOT_ACCEPTABLE, 'Token is invalid')

    //neu moi thu oke
    const updateData = {
      isActive: true,
      verifyToken: null
    }

    const updatedUser = await userModel.update(existUser._id, updateData)
    return pickUser(updatedUser)
  }
  catch (error) { throw Error(error) }
}

const login = async (reqBody) => {
  try {
    const existUser = await userModel.findOneByEmail(reqBody.email)

    if (!existUser) throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found')
    if (!existUser.isActive) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Account is not active')

    if (!bcryptjs.compareSync(reqBody.password, existUser.password))
      throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your email or password is incorrect')

    //neu moi thu oke
    //tao thong tin de dinh kem trong jwt token bao gom id va email cua user
    const userInfo = {
      _id: existUser._id,
      email: existUser.email
    }

    const accessToken = await JwtProvider.generateToken(
      userInfo,
      env.ACCESS_TOKEN_SECRET_SIGNATURE,
      // 5
      env.ACCESS_TOKEN_LIFE
    )

    const refreshToken = await JwtProvider.generateToken(
      userInfo,
      env.REFRESH_TOKEN_SECRET_SIGNATURE,
      // 15
      env.REFRESH_TOKEN_LIFE
    )

    return { accessToken, refreshToken, ...pickUser(existUser) }
  }
  catch (err)
  {
    throw Error(err)
  }
}

// const verifyAccount = async () => {
// }

const refreshToken = async (clientRefreshToken) => {
  try {
  //verify / giai ma cac refreshToken xem co hop le khong
    const refreshTokenDecoded = await JwtProvider.verifyToken(clientRefreshToken, env.REFRESH_TOKEN_SECRET_SIGNATURE)

    //lay thong tin user tu token luon, khong can query nua
    const userInfo = {
      _id: refreshTokenDecoded._id,
      email: refreshTokenDecoded.email
    }

    //tao accessToken moi
    const accessToken = await JwtProvider.generateToken(userInfo, env.ACCESS_TOKEN_SECRET_SIGNATURE,
      // 5
      env.ACCESS_TOKEN_LIFE
    )
    return { accessToken }
  }
  catch (err) {
    throw new Error(err)
  }
}

const update = async (userId, reqBody) => {
  try {
    //query user va kiem tra cho chac chan
    const existUser = await userModel.findOneById(userId)
    if (!existUser) throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found!')
    if (!existUser.isActive) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your account is not active!')

    //khoi tao ket qua updateduser ban dau la empty
    let updatedUser = {}

    //truong hop 1: changePassword
    if (reqBody.current_password && reqBody.new_password) {
      //kiem tra xem current password xem co dung khong
      if (!bcryptjs.compareSync(reqBody.current_password, existUser.password))
        throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your password or email is incorrect')
      //nguoc lai hashpassword moi tu new_password vao database
      updatedUser = await userModel.update(existUser._id, {
        password: bcryptjs.hashSync(reqBody.new_password, 8)
      })
    }
    //truong hop update thong tin chung nhu displayName
    else {
      updatedUser = await userModel.update(existUser._id, reqBody)
    }

    return pickUser(updatedUser)
  }
  catch (err) {
    throw new Error(err)
  }
}

export const userService = {
  createNew,
  login,
  verifyAccount,
  refreshToken,
  update
}