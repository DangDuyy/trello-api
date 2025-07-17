/* eslint-disable no-console */
/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */

import exitHook from 'async-exit-hook'
import express from 'express'
import cors from 'cors'
import { corsOptions } from './config/cors'
import { CLOSE_DB, CONNECT_DB } from '~/config/mongodb'
import { APIs_V1 } from '~/routes/v1'
import { env } from '~/config/environment'
import { errorHandlingMiddleware } from '~/middlewares/exampleHandlingMiddleware'
import cookieParser from 'cookie-parser'

const START_SERVER = () => {

  //fix bug cache from disk
  const app = express()

  app.use( (req, res, next) => {
    res.set('Cache-Control', 'no-store')
    next()
  })
  app.use(cors(corsOptions))

  app.use(cookieParser())

  // app.get('/', (req, res) => {
  //   // Test Absolute import mapOrder
  //   // eslint-disable-next-line no-console
  //   res.end('<h1>Hello World!</h1><hr>')
  // })

  //enable res.body json data
  app.use(express.json())

  //use api v1
  app.use('/V1', APIs_V1)

  //middle xử lý lỗi tập trung
  app.use(errorHandlingMiddleware)

  if (env.BUILD_MODE === 'production') {
    // moi truong production do render support
    app.listen(process.env.PORT, () => {
    // eslint-disable-next-line no-console
      console.log(`3. Production: Hello ${env.AUTHOR}, I am running at Port: ${ process.env.PORT }/`)
    })
  }
  else
  {
    //moi truong local dev
    app.listen(env.LOCAL_DEV_APP_PORT, env.LOCAL_DEV_APP_HOST, () => {
    // eslint-disable-next-line no-console
      console.log(`3. LocalDev: Hello ${env.AUTHOR}, I am running at ${ env.LOCAL_DEV_APP_HOST }:${ env.LOCAL_DEV_APP_PORT }/`)
    })
  }

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
