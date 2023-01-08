
const socket = io();

socket.on("connection", ()=>{
  console.log("Connected from font-end");
});

