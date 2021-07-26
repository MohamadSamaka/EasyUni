<?php
    $Fname = "Output.text";
    $Limit = $_POST['limit'];
    if(PHP_OS == "Linux")
        system('python3 ../python/Scrapper.py '.$_POST['user']. ' '. $_POST["pass"].
        ' > '.$Fname. ' 2>&1 &');
    else
        system('python3 ../python/Scrapper.py '.$_POST['user']. ' '. $_POST["pass"].
        ' > '.$Fname);
?>
