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

const updateBoardInvitation = async (userId, invitationId, status) => {
  try {
    const getInvitation = await invitationModel.findOneById(invitationId)
    if (!getInvitation) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Invitation not found!!!')
    }
    // console.log(getInvitation)
    const boardId = getInvitation.boardInvitation.boardId
    const getBoard = await boardModel.findOneById(boardId)
    if (!getBoard) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found!!!')
    }
    //kiem tra xem neu status la accepted join board ma la cai thang user(invitee) da la owner hoac member cua board roi thi tra ve thong bao loi luon
    //note: 2 mang memberIds va ownerIds cua board no dang la kieu du lieu objectId nen cho no sang string de de check
    //spread operator de noi mang(hoac dung concat)
    const boardOwnerAndMemberIds = [...getBoard.ownerIds, ...getBoard.memberIds].toString()
    if (status === BOARD_INVITATION_STATUS.ACCEPTED && boardOwnerAndMemberIds.includes(userId)) {
      throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'You cannot invite already member to this board')
    }

    const updatedData = {
      boardInvitation: {
        ...getInvitation.boardInvitation,
        status: status
      }
    }
    //b1
    const result = await invitationModel.update(invitationId, updatedData)

    //b2 them inviterid vao memberIds cua board
    if (result.boardInvitation.status === BOARD_INVITATION_STATUS.ACCEPTED) {
      await boardModel.pushMemberIds(boardId, userId)
    }
    return result
  }
  catch (err) {
    throw new Error(err)
  }
}
export const invitationService = {
  createNewBoardInvitation,
  getInvitations,
  updateBoardInvitation
}