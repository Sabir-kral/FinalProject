
async function signUp(event) {
    event.preventDefault()
    const name = document.getElementById("input");
    const surname = document.getElementById("inputIki");
    const email = document.getElementById("inputUc");
    const username = document.getElementById("inputDord");
    const password = document.getElementById("inputBes");

    const request = {
        name:name.value,
        surname:surname.value,
        email:email.value,
        username:username.value,
        password:password.value,
    }
    const response = await fetch("http:
        method:"POST",
        headers: {"Content-Type":"application/json"},
        body:JSON.stringify(request)
    });

    const data = await response.json();
    if (response.ok){
        document.getElementById("result").style.color = "green";
        document.getElementById("result").innerText = "succesfully registered";
        setInterval(() => {
            window.location.href = "login.html"
        }, 2000);
    } else{
        document.getElementById("result").style.color = "red";
        document.getElementById("result").innerText = "error"||data.message;
    }
}
