function handleCredentialResponse( response ) {
  // Google Token: ID_TOKEN

  const body = { "id_token": response.credential };

  console.log(body);

  fetch(`http://localhost:8080/api/auth/google`, {
    method: "POST",
    headers: {
      "Content-type": "application/json"
    },
    body: JSON.stringify(body)
  })
    .then( res =>res.json())
    .then( res =>{

      console.log( res );

      const email = res.user.email;
      const token = res.token;
      // const name = res.user.name;
      // const img = res.user.img;

      localStorage.setItem( "email", email );
      localStorage.setItem( "token", token );

    })
    .catch( err => console.log(err));
};

const button = document.getElementById("google_signout");

button.onclick = async () =>{

  google.accounts.id.disableAutoSelect();

  const email = await localStorage.getItem("email");

  google.accounts.id.revoke(email, done =>{

    localStorage.clear();

    location.reload();
  });
};