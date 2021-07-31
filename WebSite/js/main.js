$.get("../html/login.html", function(data){
    $("body").append(data);
});

$(document).ready(function() {
    var imported = document.createElement('script');
    var imported2 = document.createElement('script');
    imported.src = '../js/InfoPage.js';
    document.head.appendChild(imported);
    imported2.src = '../js/js.js';
    document.head.appendChild(imported2);
});