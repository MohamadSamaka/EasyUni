<?php
    $Fname = "Output.text";
    system('python3 ../python/Scrapper.py '.$_GET['user']. ' '. $_GET["pass"].
    ' > '.$Fname. ' 2>&1 &');
    require('login.php');
    login($Fname);
?>