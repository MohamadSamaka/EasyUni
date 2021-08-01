var JsonData;
var ArTableHeader = ["المبنى", "قاعة", "المحاضر", "الوقت", "الشعبة", "عدد الساعات المعتمدة", "النشاط",  "رمز المقرر", "اسم المقرر"];
var EnTableHeader = ["Course Name", "Course Code", "Activity", "Confirmed Hours", "Section", "Time",  "Instructor", "Room", "Building"];
var WholeDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
// var CurrentSemesterDays;
var SelectedDay;
var SelectedSemesterElement;
var SelectedSemesterName;
var InsertedBefore = false;
var lang = "ar";
var SemesterDaysCount;
function sleep(ms) { 
    return new Promise(resolve => setTimeout(resolve, ms));
  }


async function PrepareInfoPage() {
    AppendPage();
    FetchData();
    await sleep(2000); // i have to wait idk why, it looks like that the dom isn't fully loaded imma search on this later
    CreateAppendTable();
    GetElements();
    CreateOptions();
    AddListeners();
    // TableInserter();
    DeleteLoginPageElements();
    DisableSlider();
    ReportWrapper.style.display = "none";
}

function AppendPage() {
    $.get("../html/InfoPage.html", function(data){
        $("body").append(data);
    });
}

function FetchData() { //brings the json file
    fetch("../Data.json")
    .then(function(response) {
        return response.json();
    })
    .then(function(jsonResponse) {
        JsonData = jsonResponse;
        ReCreateJson()
        // TableInserter()
    });
}


function ReCreateJson(){
    for (const key in JsonData){
        var CoursesPerDay = {};
        JsonData[key].forEach(DataRow => { //loops in each semester's rows
            var days = DataRow[7].match(/([A-Z]|[a-z])+\b/g); //gets the days from the string
            var data = DataRow[7].match(/(([^A-z ])+|[A-D])+/g); //gets the time and room
            for (var i = 0, j = 0; i < days.length; i++, j += 2){ //the even values satands for the time, odd values stands for the room
                var tempRow = DataRow.slice(); // makes a copy of the current row
                if(!CoursesPerDay.hasOwnProperty(days[i])) //checks if the day exist or not to avoid re-creating the key instaed of appending it
                    CoursesPerDay[days[i]] = []
                tempRow[5] = data[j]; //takes the time only
                tempRow[7] = data[j + 1]; // takes room only
                CoursesPerDay[days[i]].push(tempRow) //appends the array with the processed row
            }
            JsonData[key] = CoursesPerDay; // re-set the value of the key (which is a a dictiony its keys are days and values are the rows of courses)
        });
  }
}


function CreateAppendTable() {
    var Table = document.createElement('table');
    Table.classList.add("content-table");
    var header = Table.createTHead();
    var row = header.insertRow(0);  
    ArTableHeader.forEach(th => {
        row.appendChild(document.createElement('th')).innerText=th;
    });

    Table.appendChild(document.createElement('tbody'))
    document.body.appendChild(Table);
}



function GetElements() {
    SelectElement = document.getElementById('slct');
}


function CreateOptions(){
    Object.keys(JsonData).forEach(function(key) {
        var opt = document.createElement('option');
        opt.innerHTML = key;
        SelectElement.appendChild(opt);
      }) 
}


function AddListeners(){
    SelectElement.addEventListener('change',GetSelectedSemester)
}


function GetSelectedSemester(){
    RemoveTableChildrens();
    SelectedSemesterName = SelectElement.options[SelectElement.selectedIndex].text;
    SemesterDaysCount = Object.keys(JsonData[SelectedSemesterName]).length; //gets the number of how many rows needed
    // TableInserter(SelectedSemester);
    CreateButtons();
}


function RemoveTableChildrens(){
    var childs = document.querySelector("body > table > tbody").children;
    var l = childs.length ;
    if ( l != 0){
        for(var i = 0; i < l; i++)
            childs[0].remove();
        // childs.forEach(child => { #this gives an error idk why
        //     child.remove();
        // });
    }
}


function TableInserter(d){
    SelectedDay = WholeDays[parseInt(this.value)];
    TableBodyReplacer();
    var v = 0;
    var rows;
    rows = document.querySelectorAll("body > table > tbody > tr"); //gets all the made rows
    // var days = Object.keys(JsonData[SelectedSemesterName]) //gets the days
    JsonData[SelectedSemesterName][SelectedDay].forEach(course => {
                course.forEach(PieceOfData => {
                    if(PieceOfData == "-1")
                        rows[v].insertCell(0).innerText = "وهمي";
                    else
                        rows[v].insertCell(0).innerText = PieceOfData;
                });
        v++;
    });
}


function TableBodyReplacer(){
    var new_tbody = document.createElement('tbody');
    RowsMaker(new_tbody);
    old_tbody = document.querySelector("body > table > tbody");
    old_tbody.parentNode.replaceChild(new_tbody, old_tbody);
}

function RowsMaker(tbody){ // makes the rows
    for (var i = 0; i < JsonData[SelectedSemesterName][SelectedDay].length; i++)
        tbody.insertRow();
}




function CreateButtons(){
    previous_btns = document.getElementById("days")
    if( previous_btns != null)
        previous_btns.remove();

    var DayButtonsContainer = document.createElement('div');
    DayButtonsContainer.id = "days";
    let o = new Intl.DateTimeFormat(lang , {
        weekday: "long"
      });
      
    for(var i = 0; i < SemesterDaysCount; i++){
        btn = document.createElement('button');
        var d = WholeDays.indexOf(Object.keys(JsonData[SelectedSemesterName])[i])
        btn.innerText = o.format(Date.UTC(2020,10,d + 1));
        btn.value = d;
        btn.addEventListener('click', TableInserter);
        DayButtonsContainer.appendChild(btn);
    }
    document.body.appendChild(DayButtonsContainer)
}

