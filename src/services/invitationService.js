import { StatusCodes } from 'http-status-codes'
import { boardModel } from '~/models/boardModel'
import { userModel } from '~/models/userModel'
import ApiError from '~/utils/ApiError'
import { pickUser } from '~/utils/formatter'
import { invitationModel } from '~/models/invitationModel'
import { INVITATION_TYPES } from '~/utils/constants'
import { BOARD_INVITATION_STATUS } from '~/utils/constants'
const createNewBoardInvitation = async (reqBody, inviterId) => {
  try {
    const inviter = await userModel.findOneById(inviterId)
    const invitee = await userModel.findOneByEmail(reqBody.inviteeEmail)
    //tim luon cai board ra de lay data xu ly
    const board = await boardModel.findOneById( reqBody.boardId )

    //neu khong ton tai 1 trong 3 field kia thi cu reject
    if (!invitee || !inviter || !board) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Inviter, invitee or board not found!')
    }
    //tao data can thiet de luu vao trong db
    //co the thu bo hoac lam sai lech type, boardInvitation, status de test xem model validate da oke chua
    const newInvitationData = {
      inviterId,
      inviteeId: invitee._id.toString(), //chuyen tu objectId ve string vi sang ben Model co check lai data o ham create
      type: INVITATION_TYPES.BOARD_INVITATION,
      boardInvitation: {
        boardId: board._id.toString(),
        status: BOARD_INVITATION_STATUS.PENDING
      }
    }
    //goi sang model de luu vao database
    const createInvitation = await invitationModel.createNewBoardInvitation(newInvitationData)
    const getInvitation = await invitationModel.findOneById(createInvitation.insertedId.toString())

    //ngoai thong tin cua board invitation moi tao thi tra ve du ca luon board, inviter, invitee cho fe thoai mai xu ly
    const resInvitation = {
      ...getInvitation,
      board,
      inviter: pickUser(inviter),
      invitee: pickUser(invitee)
    }
    return resInvitation
  }
  catch (err) {
    throw new Error(err)
  }
}

const getInvitations = async (userId) => {
  try {
    //vi cac phan tu inviter, invitee, board dang la mang 1 gia tri nen bien no ve json object truoc khi tra no ve cho fe
    const getInvitations = await invitationModel.findByUser(userId)

    //cach 1
    // const resInvitations = getInvitations.map(i => {
    //   return {
    //     ...i,
    //     inviter: i.inviter[0] || {},
    //     invitee: i.invitee[0] || {},
    //     board: i.board[0] || {}
    //   }
    // })
    //cach 2
    const resInvitations = getInvitations.map(i => ({
      ...i,
      inviter: i.inviter[0] || {},
      invitee: i.invitee[0] || {},
      board: i.board[0] || {}
    }))
    return resInvitations
  }
  catch (err) {
    throw new Error(err)
  }
}

export const invitationService = {
  createNewBoardInvitation,
  getInvitations
}