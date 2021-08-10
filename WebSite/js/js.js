var AnimatedBackground = document.querySelector("body > div.animation-area");
var LayoutWrapper = document.querySelector("#layout-wrapper");
var Form = document.querySelector("#login-form-wrapper > form");
var Body = document.querySelector("body");
var ReportWrapper = document.getElementById("report");
var Report = document.querySelector("#report > div > span:nth-child(1)");
var i;

Form.addEventListener("submit", Submit);

function Submit(e){
    e.preventDefault();
    if(!window.navigator.onLine){
        alert("[-] Check Your Connection");
        return;
    }
    EnableSlider()
    var user = document.querySelector("#user").value;
    var pass = document.querySelector("#pass").value;
    var parms = `user=${user}&pass=${pass}`
    var xhr = new XMLHttpRequest();
    xhr.open("POST","../php/Main.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(parms);

    ProccessesTracker();
}

async function ProccessesTracker(){
    var process = ["Connect", "Login In", "Get The Token", "Navigate",
                    "Get Your Semesters", "Collect Data"];
    for(i = 1; i <= 6; i++){
        try{
            Report.innerText = "Trying To " + process[i - 1];
            var response = await RequestsMaker();
            if(!Boolean(parseInt(response[0]))){
                RedirectToLoginPage();
                break;
            }
            else{
                ReportWrapper.style.display = "block";
                Report.innerText = response[1];
            }
            if(i == 6){
                // AppendPage()
                PrepareInfoPage();
                
            }
        }catch(err){
            console.log(err);
        }
    }
}

function RequestsMaker() {
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.open("POST","../php/ProcessTracker.php", true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onload=function(){
            var result = this.responseText.trim().split('|');
            resolve(result);
        }
        xhr.send(`id=${i}`);
    })
}


function RedirectToLoginPage() {
    DisableSlider();
    if (i == 2)
        alert("LogginFailed");
    ReportWrapper.style.display = "none";
}


function EnableSlider(){
    if(Body.classList.contains("disable-slider"))
        Body.classList.remove("disable-slider");
    Body.classList.add("enable-slider");
}

function DisableSlider(){
    if(Body.classList.contains("enable-slider"))
        Body.classList.remove("enable-slider");
    Body.classList.add("disable-slider");
}

function DeleteLoginPageElements(){
    // AnimatedBackground.remove();
    LayoutWrapper.remove();
}
