/* eslint-disable no-console */
/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */

import exitHook from 'async-exit-hook'
import express from 'express'
import { CLOSE_DB, CONNECT_DB } from '~/config/mongodb'
import { env } from '~/config/environment'
const START_SERVER = () => {


  const app = express()

  app.get('/', async (req, res) => {
    // Test Absolute import mapOrder
    // eslint-disable-next-line no-console
    res.end('<h1>Hello World!</h1><hr>')
  })

  app.listen(env.APP_PORT, env.APP_HOST, () => {
    // eslint-disable-next-line no-console
    console.log(`3. Hello ${env.AUTHOR}, I am running at ${ env.APP_HOST }:${ env.APP_PORT }/`)
  })

  exitHook(() => {
    console.log('4. Disconnecting from MongoDB Cloud Atlas')
    CLOSE_DB()
    console.log('5. Disconnecting from MongoDB Cloud Atlas')
  })

}

(async () => {
  try {
    //chi khi ket noi database thanh cong moi start server
    console.log('1. Connect to MongoDB Atlas')
    await CONNECT_DB()
    console.log('2. Connect to MongoDB Atlas')
    START_SERVER()
  }
  catch (error) {
    console.error(error)
    process.exit(0)
  }
})()

// console.log('1. Connect to MongoDB Atlas')
// CONNECT_DB()
//   .then( () => console.log('2. Connect to MongoDB Atlas'))
//   .then( () => START_SERVER())
//   .catch( error => {
//     console.error(error)
//     process.exit(0)
//   })
