<?php
    if(PHP_OS == "Linux")
        system('python3 ../python/Scrapper.py '.$_POST['user']. ' '. $_POST["pass"].
        ' > '.$Fname. ' 2>&1 &');
    else
        pclose(popen('start /B python3 ../python/Scrapper.py '.$_POST['user']. ' '. $_POST["pass"].
        ' > '.$Fname, "r"));
?>
