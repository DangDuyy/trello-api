import express from 'express'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { invitationValidations } from '~/validations/invitationValidation'
import { invitationController } from '~/controllers/invitationController'

const Router = express.Router()

Router.route('/board')
  .post(authMiddleware.isAuthorized, invitationValidations.createNewBoardInvitation, invitationController.createNewBoardInvitation)

export const invitationRoutes = Router