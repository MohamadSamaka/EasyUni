var LayoutWrapper = document.querySelector("#layout-wrapper");
var Form = document.querySelector("#login-form-wrapper > form");
var Body = document.querySelector("body");
var requests = [];
var i;
Form.addEventListener("submit", Submit);

function Submit(e){
    e.preventDefault();
    Body.classList.add("enable-slider");
    var user = document.querySelector("#user").value;
    var pass = document.querySelector("#pass").value;
    var parms = `user=${user}&pass=${pass}`
    var xhr = new XMLHttpRequest();
    xhr.open("POST","Main.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onload=function(){
        console.log("------------------------------");
        console.log("SubmitFunction:")
        console.log(this.responseText);
    }
    xhr.send(parms);

    ProccessesTracker();
}

async function ProccessesTracker(){
    for(i = 1; i <= 2; i++){
        try{
            var response = await RequestsMaker();
            console.log(response[1] + ':');
            console.log(Boolean(parseInt(response[0])));
            if(!Boolean(parseInt(response[0])))
                break;
        }catch(err){
            console.log(err);
        }
    }
}

function RequestsMaker() {
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.open("POST","ProcessTracker.php", true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onload=function(){
            console.log("------------------------------");
            var result = this.responseText.trim().split(' ');
            resolve(result);
        }
        xhr.send(`id=${i}`);
    })
}
