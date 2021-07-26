// alert("hello world");

var LayoutWrapper = document.querySelector("#layout-wrapper");
var Form = document.querySelector("#login-form-wrapper > form");
var Body = document.querySelector("body");
Form.addEventListener("submit", Login);

function Login(e){
    e.preventDefault();
    var user = document.querySelector("#user").value;
    var pass = document.querySelector("#pass").value;
    var prams = "user="+user+"&pass="+pass+"&limit=2"
    Body.classList.add("enable-slider");
    var xhr = new XMLHttpRequest();
    xhr.open("POST","Main.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onload=function(){
        console.log(this.responseText);
    }
    xhr.send(prams);
}