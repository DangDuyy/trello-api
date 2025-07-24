import { StatusCodes } from 'http-status-codes'
import multer from 'multer'
import ApiError from '~/utils/ApiError'
import { ALLOW_COMMON_FILE_TYPES, LIMIT_COMMON_FILE_SIZE } from '~/utils/validators'
//function to control file which is accepted
const customFileFilter = (req, file, callback) => {
  // console.log('MulterFile: ', file)
  //doi voi multer, kiem tra kiem file thi su dung mimetype
  if (!ALLOW_COMMON_FILE_TYPES.includes (file.mimetype)) {
    const errMsg = 'File type is invalid. Only accept jpg, jpeg and png '
    return callback(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errMsg), null)
  }
  //truong hop file hop le
  callback(null, true)
}

//khoi tao function upload duoc boc boi multer
const upload = multer({
  limits: { fileSize: LIMIT_COMMON_FILE_SIZE },
  fileFilter: customFileFilter
})

export const multerUploadMiddleware={
  upload
}