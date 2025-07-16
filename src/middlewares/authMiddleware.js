import { StatusCodes } from 'http-status-codes'
import { JwtProvider } from '~/providers/JwtProvider'
import { env } from '~/config/environment'
import ApiError from '~/utils/ApiError'

//middleware nay se dam nhiem vai tro quan trong: xac thuc cai jwt accesstoken nhan duoc tu phia FE co hop le hay khong 

const isAuthorized = async (req, res, next) => {
  //lay access token tu request cookies phia client-  withCredential trong file authorizeAxios
  const clientAccessToken = req.cookie?.accessToken

  if (!clientAccessToken)
  {
    next(new ApiError( StatusCodes.NOT_ACCEPTABLE, 'Unauthorized: {Token not found}'))
    return
  }

  try {
    //b1: thuc hien giai ma token xem no co hop le hay khong
    const accessTokenDecoded = await JwtProvider.verifyToken(clientAccessToken, env.ACCESS_TOKEN_SECRET_SIGNATURE)
    console.log(accessTokenDecoded)

    //b2: neu token hop le: luu thong tin gia ma hop le (accessTokenDecoded) luu tiep vao request
    req.JwtDecoded = accessTokenDecoded

    //b3: cho phep request di tiep(hop le)
    next()
  }
  catch (err) {
    console.log(err)
    //th1: neu accessToken het han
    if (err?.message?.includes('jwt expired')) {
      next (new ApiError(StatusCodes.GONE, 'Need to refresh token.'))
      return
    }

  }
}

export const authMiddleware = {
  isAuthorized
}