var JsonData;
var ArTableHeader = ["المبنى", "قاعة", "المحاضر", "الوقت", "الشعبة", "عدد الساعات المعتمدة", "النشاط",  "رمز المقرر", "اسم المقرر"];
var EnTableHeader = ["Course Name", "Course Code", "Activity", "Confirmed Hours", "Section", "Time",  "Instructor", "Room", "Building"]
var SelectElement;
var SelectedSemester;//= document.getElementById('slct');
                     //select.options[select.selectedIndex].text
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


async function PrepareInfoPage() {
    AppendPage();
    FetchData();
    await sleep(2000);
    CreateAppendTable();
    GetElements();
    CreateOptions();
    AddListeners();
    TableInserter();
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



function TableInserter(){
    var v = 0;
    console.log(document.querySelector("body > table > tbody"))
    var name = Object.keys(JsonData)[0]; //temporary test, working on 1 semester not more
    var length = Object.keys(JsonData[name]).length; //gets the number of how many rows needed
    var rows;
    [...Array(length).keys()].forEach(num => { // makes the rows
        document.querySelector("body > table > tbody").insertRow();
    });
    rows = document.querySelectorAll("body > table > tbody > tr"); //gets all the made rows
    var days = Object.keys(JsonData[name]) //gets the days
    JsonData[name][days[0]].forEach(course => {
                course.forEach(PieceOfData => {
                    rows[v].insertCell(0).innerText = PieceOfData;
                });
                v++;
           });
    // rows.forEach(row => {
    //     days.forEach(day => {
    //     JsonData[name][day].forEach(course => {
    //         course.forEach(PieceOfData => {
    //             row.insertCell(-1).innerText = PieceOfData;
    //         });
    //    });
    // });
    // });
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
    SelectElement.addEventListener('change',GetSelectedText)
}


function GetSelectedText(){
    SelectedSemester = SelectElement.options[SelectElement.selectedIndex].text;
}




