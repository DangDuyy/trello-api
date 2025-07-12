import { Resend } from 'resend'
import { env } from '~/config/environment'

const RESEND_API_KEY = env.RESEND_API_KEY
const resendInstance = new Resend(RESEND_API_KEY)
const ADMIN_SENDER_EMAIL = env.ADMIN_EMAIL_ADDRESS
console.log(ADMIN_SENDER_EMAIL)
const sendEmail = async ({ to, subject, html }) => {
  try {
    const data = await resendInstance.emails.send({
      from: ADMIN_SENDER_EMAIL,
      to,
      subject,
      html
    })
    return data
  }
  catch (error) {
    throw new Error(error)
  }

}

export const ResendProvider = {
  sendEmail
}