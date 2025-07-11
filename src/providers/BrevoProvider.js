/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */
const SibApiV3Sdk = require('@getbrevo/brevo')
import { env } from '~/config/environment'

let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi()
let apiKey = apiInstance.authentications['apiKey']
apiKey.apiKey = env.BREVO_API_KEY

const sendEmail = async (recipientEmail, customSubject, htmlContent) => {
  try {
    let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail()

    //tai khoan gui mail
    sendSmtpEmail.sender = {
      email: env.ADMIN_EMAIL_ADDRESS,
      name: env.ADMIN_EMAIL_NAME
    }

    //tai khaon nhan mail
    sendSmtpEmail.to = [{ email: recipientEmail }]

    //tieu de cua email
    sendSmtpEmail.subject = customSubject

    //noi dung email dang html
    sendSmtpEmail.htmlContent = htmlContent

    //goi hanh dong gui mail
    return apiInstance.sendTransacEmail(sendSmtpEmail)
  } catch (error) {
    console.error('Brevo API Error:', error)
    throw new Error(`Email sending failed: ${error.message}`)
  }
}

export const BrevoProvider = {
  sendEmail
}