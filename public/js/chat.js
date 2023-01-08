
const URL = "http://localhost:8080/api/auth";

let user = null;
let socket = null;

// References HTML

const txtUid = document.querySelector("#txtUid");
const txtMsg = document.querySelector("#txtMsg");
const ulUsers = document.querySelector("#ulUsers");
const ulMessages = document.querySelector("#ulMessages");
const btnExit = document.querySelector("#btnExit");

const validateJWT = async () =>{

  const token = localStorage.getItem("token") || "";

  if( token.length <= 10 ){
    window.location = "index.html";

    throw new Error("There's no token in the server");
  };

  const resp = await fetch( URL ,{
    headers:{
      "authorization": token
    }
  });

  const { user: userDB, token: tokenDB } = await resp.json();

  localStorage.setItem("token", tokenDB);

  user = userDB;

  document.title = user.name;

  await connectSocket();

};

const connectSocket = async () =>{

  socket = io({
    "extraHeaders": {
      "authorization": localStorage.getItem( "token" )
    }
  });

  socket.on("connect", () =>{
    console.log("Socket Online");
  });

  socket.on("disconnect", ()=>{
    console.log("Sockets Offline");
  });

  socket.on("receive-messages", drawMessages);

  socket.on("active-users", drawUsers);

  socket.on("private-message", ( payload ) =>{
    console.log("private:", payload)
  });
};

const drawUsers = ( users = [] ) =>{

  let usersHTML = "";

  users.forEach( ({ name, uid }) =>{

    usersHTML += `
      <li>
        <p>
          <h5 class="text-success">${ name }</h5>
          <span class="fs-6 text-muted">${ uid }</span>
        </p>
      </li>
    `;

    ulUsers.innerHTML = usersHTML;
  });
};

txtMsg.addEventListener("keyup", ({ keyCode }) =>{

  const uid = txtUid.value;
  const message = txtMsg.value;

  if( keyCode !== 13 ){ return; };
  if( message.length === 0 ){ return; };

  socket.emit("send-message", { message, uid });

});

const drawMessages = ( messages = [] ) =>{

  let messagesHTML = "";

  messages.forEach( ({ name, message }) =>{

    messagesHTML += `
      <li>
        <p>
          <span class="text-primary">${ name }:</span>
          <span>${ message }</span>
        </p>
      </li>
    `;

    ulMessages.innerHTML = messagesHTML;
  });
};

const main = async () =>{

  await validateJWT();

};

main();
