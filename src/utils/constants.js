/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */
import { env } from '~/config/environment'

//nhung domain duoc phep hoat dong
export const WHITELIST_DOMAINS = [
// khong can them vo localhost vi da cho phep environment dev duoc su dung roi
  'https://mern-trello-app-five.vercel.app'
]

export const BOARD_TYPES = {
  PUBLIC: 'public',
  PRIVATE: 'private'
}

export const WEBSITE_DOMAIN = ( env.BUILD_MODE === 'production' ? env.WEBSITE_DOMAIN_PRODUCTION: env.WEBSITE_DOMAIN_DEVELOPER)