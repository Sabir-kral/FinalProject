    let form = document.querySelector(".f")
let users = JSON.parse(localStorage.getItem("users"))||[];
form.addEventListener("submit",(event)=>{
    event.preventDefault()
let input1 = document.querySelector("#input")
let input2 = document.querySelector("#inputIki")
let input3 = document.querySelector("#inputUc")
let input4 = document.querySelector("#inputDord")
let input5 = document.querySelector("#inputBes")
    let object = {
        name:input1.value,
        surname:input2.value,
        email:input3.value,
        username:input4.value,
        password:input5.value
    }
    users.push(object)
    localStorage.setItem("users",JSON.stringify(users))


})/* RESET */
