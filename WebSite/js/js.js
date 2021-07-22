// alert("hello world");

var LayoutWrapper = document.querySelector("#layout-wrapper");
var Form = document.querySelector("#login-form-wrapper > form");
var Body = document.querySelector("body");
Form.addEventListener("submit", Login);

function Login(e){
    e.preventDefault();
    var user = document.querySelector("#user").value;
    var pass = document.querySelector("#pass").value;
    Body.classList.add("enable-slider");
    var xhr = new XMLHttpRequest();
    xhr.open("GET","ScriptExecutor.php?user="+user+"&pass="+pass, true);
    xhr.onload=function(){
        console.log(this.responseText);
    }
    xhr.send();
}