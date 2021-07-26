<?php
    $Fname = "Output.text";
    if(PHP_OS == "Windows")
        system('python3 ../python/Scrapper.py '.$_GET['user']. ' '. $_GET["pass"].
        ' > '.$Fname. ' 2>&1 &');
    else
        system('python3 ../python/Scrapper.py '.$_GET['user']. ' '. $_GET["pass"].
        ' > '.$Fname);
?>
