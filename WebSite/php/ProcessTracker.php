<?php
    require('Processes.php');
?>

<?php
    $CheckId;
    $Fname = "Output.text";
    if(isset($_POST['id'])){ #checks if the id has been set or not
        $CheckId =  (int)$_POST['id'];
        Track($Fname ,$CheckId);
    }
?>

<?php
    function Track($Fname, $CheckId){ #informing the proccess with the wanted process to be tracked
        $count = $CheckId * 2; #the number of elemnts supposed to be in the array before target element appears
        $r = Process($Fname, $count, $count - 2); #count-2 stands for the start head of the wanted process
        Report($r, $CheckId - 1);
        if($r) #im not sure if i need this until now i will check later
            die;
            
    }
?>

<?php
    function Report($b, $i){ #sends the result of prcoess
        $Proccesses = array("Connected", "Loged In", "Got The Token", "Navigated", "Found The Semesters", "Data Has Been Obtained");
        $r = "";
        if($b) $r.= "0|"; #gives 0 if the process failed
        else $r .= "1|";#gives 0 if the process succeded 
        $r .= $Proccesses[$i]; #adds the process info
        echo $r;
    }
?>
