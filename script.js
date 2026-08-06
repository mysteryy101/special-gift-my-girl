window.onload = function () {

setTimeout(function () {

document.getElementById("loading").style.display = "none";

document.getElementById("passwordPage").style.display = "flex";

},3000);

};

function checkPassword(){

let pass = document.getElementById("password").value;

if(pass=="2024"){

document.getElementById("passwordPage").style.display="none";

document.getElementById("main").style.display="flex";

}else{

alert("Wrong Password 💔");

}

}

function nextSection(){

alert("Welcome Maha 🤍\n\nThis is only the beginning...\nOur story starts here 🌸");

}
