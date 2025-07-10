import { userModel } from '~/models/userModel'

const createNew = async (data) => {
  try {
    const result = await userModel.createNew(data)
    return result
  }
  catch (err) {
    throw new Error(err)
  }
}

export const userService = {
  createNew
}