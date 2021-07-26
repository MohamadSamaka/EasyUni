<?php
    $Fname = "Output.text";
    if(PHP_OS == "Windows")
        system('python3 ../python/Scrapper.py '.$_POST['user']. ' '. $_POST["pass"].
        ' > '.$Fname. ' 2>&1 &');
    else
        system('python3 ../python/Scrapper.py '.$_POST['user']. ' '. $_POST["pass"].
        ' > '.$Fname);
?>
