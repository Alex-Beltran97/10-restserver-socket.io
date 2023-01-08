const { Socket } = require("socket.io");
const { checkJWT } = require("../helpers");
const ChatMessages = require("../models/Chat-messages");

const chatMessages = new ChatMessages();

const socketController = async ( socket = new Socket(), io ) =>{
  
  const { authorization: token } = socket.handshake["headers"];

  const user = await checkJWT( token );

  if( !user ){

    return socket.disconnect();
  };

  // Add Connected User

  chatMessages.connectUser( user );
  io.emit("active-users", chatMessages.usersArr);
  socket.emit("receive-messages", chatMessages.lastTen);
  
  //Connect to a specific room
  socket.join( user.id ); // Global, Socket.id, User.id

  // Clean when someone going to disconnect

  socket.on("disconnect", () =>{
    chatMessages.disconnectUser( user._id );
    io.emit( "active-users", chatMessages.usersArr );
  });

  socket.on("send-message", ({ uid, message }) =>{

    if( uid ){
      socket.to( uid ).emit( "private-message", { from:user.name, message });
    } else {

      chatMessages.sendMessage( user._id, user.name, message );
      io.emit("receive-messages", chatMessages.lastTen);
    };
  
  });
};

module.exports = {
  socketController
};