import JWT from 'jsonwebtoken'

// function tao moi token - can 3 tham so dau vao
//userInfo: nhung thong tin muon dinh kem vao token
//secretSignature : chu ky bi mat( 1 dang chuoi string ngau nhien ) tren docs thi de ten la privateKey deu cung 1 y nghia
//tokenlife : thoi gian song cua token
const generateToken = async (userInfo, secretSignature, tokenLife) => {
  try {
    //ham sign cua thu vien JWT - Thuat toan mac dinh la HS256, cu hco code vao de nhin
    return JWT.sign(userInfo, secretSignature, { algorithm: 'HS256', expiresIn: tokenLife })
  }
  catch (err) {
    throw new Error(err)
  }
}

// function kiem tra 1 token co hop le hay khong
//hop le o day duoc hieu don gian la cai token duoc tao ra co dung voi chu ky bi mat signature hay khong
const verifyToken = async (token, secretSignature) => {
  try {
    //
    return JWT.verify(token, secretSignature)
  }
  catch (err) {
    throw new Error(err)
  }
}

export const JwtProvider = {
  generateToken,
  verifyToken
}