const myForm = document.querySelector("form");

const URL = "http://localhost:8080/api/auth";


function formAction ( e ){

  e.preventDefault();

  const formData = new FormData( this );

  const email = formData.get("email");
  const password = formData.get("password");

  const body = { email, password };

  fetch( `${ URL }/login`, {
    method: "POST",
    headers:{
      "Content-Type": "application/json"
    },
    body: JSON.stringify( body )
  })
  .then( res => res.json())
  .then( data => {

    if( data.errors ){
      return console.error({errors: data.errors});
    };
  
    if( data.msg ){
      return console.error({errors: data.msg});
    };

    localStorage.setItem("email", data.user.email);
    localStorage.setItem("token", data.token);

    window.location = "chat.html";

  })
  .catch( err => console.error(err));

};

myForm.addEventListener("submit", formAction);


function handleCredentialResponse(response) {
  // Google Token: ID_TOKEN

  const body = { id_token: response.credential };

  console.log(body);

  fetch(`${ URL }/google`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((res) => res.json())
    .then((res) => {
      console.log(res);

      const email = res.user.email;
      const token = res.token;
      // const name = res.user.name;
      // const img = res.user.img;

      localStorage.setItem("email", email);
      localStorage.setItem("token", token);

      
      window.location = "chat.html";
    })
    .catch((err) => console.log(err));
}

const button = document.getElementById("google_signout");

button.onclick = async () => {
  google.accounts.id.disableAutoSelect();

  const email = await localStorage.getItem("email");

  google.accounts.id.revoke(email, (done) => {
    localStorage.clear();

    location.reload();
  });
};
