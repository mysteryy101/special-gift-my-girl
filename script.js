function checkPassword() {

let year = document.getElementById("year").value;
let error = document.getElementById("error");

if (year === "2024") {

document.getElementById("password-page").style.display = "none";

document.getElementById("loading-page").style.display = "flex";

setTimeout(function () {

document.getElementById("loading-page").style.display = "none";

document.getElementById("home-page").style.display = "flex";

},3000);

} else {

error.innerHTML = "❌ Wrong Year! Try Again ❤️";

}

}

function nextStory(){

alert("❤️ Our Story page will open here in the next update!");

}
