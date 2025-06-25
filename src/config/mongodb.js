/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */
import { env } from '~/config/environment'
import { MongoClient, ServerApiVersion } from 'mongodb'

//khởi tạo đối tượng trelloDatabaseInstance ban đầu là null , vì chưa connect
let trelloDatabaseInstance = null

//luu y: cai server api phien ban mongodb tu 5.0.0 tro len, co the khong can dung no
const mongoClientInstance = new MongoClient( env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors:true
  }
})

export const CONNECT_DB = async () => {
  //goi ket noi toi mongodb atlas voi uri cua moi nguoi
  await mongoClientInstance.connect()

  trelloDatabaseInstance = mongoClientInstance.db(env.DATABASE_NAME)
}

//function get_db nay co nhiem vu export ra cai trello database instanse sau khi da connect thanh cong toi mongodb de chung ta su dung nhieu noi khac nhau trong code.
export const GET_DB = () => {
  if (!trelloDatabaseInstance) throw new Error('MUST CONNECT DATABASE FIRST')
  return trelloDatabaseInstance
}

export const CLOSE_DB = async () => {
  await mongoClientInstance.close()
}