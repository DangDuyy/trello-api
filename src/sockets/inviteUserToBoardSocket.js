export const inviteUserToBoardSocket = (socket) => {
  //lang nghe su kien ma client emit co ten la : FE_USER_INVITED_TO_BOARD
  socket.on('FE_USER_INVITED_TO_BOARD', (invitation) => {
    //cach lam nhanh va don gian nhat: emit nguoc lai 1 su kien ve cho moi client khac (ngoai tru chinh cai thang gui request len), roi ve phia fe check
    socket.broadcast.emit('BE_USER_INVITED_TO_BOARD', invitation)
  })
}