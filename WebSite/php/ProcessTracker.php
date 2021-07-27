<?php
    require('Processes.php');
?>

<?php
    #loops the number of times of process and cheks each process
    #the i var stands for the number of processes and its the start point
    #the j var stands for the start head index
    // for($i = $StartPoint, $j = 2; $i < $Limit; $i++, $j+=2){
    //     $r = Process($Fname, $j, $j - 2);
    //     Report($r, $i);
    //     if($r)
    //         die;
    // }
    $Fname = "Output.text";
    $CheckId;
    if(isset($_POST['id'])){
        $CheckId =  (int)$_POST['id'];
        Track($Fname ,$CheckId);
    }
?>

<?php
    function Track($Fname, $CheckId){
        $count = $CheckId * 2; #the number of elemnts supposed to be in the array before target element appears
        $r = Process($Fname, $count, $count - 2);
        Report($r, $CheckId - 1);
        if($r)
            die;
            
    }
?>

<?php
    function Report($b, $i){ #for testing for now no more
        $Proccesses = array("Connection", "Login", "Token", "Navigating", "SemestersFinding", "ObtainingData");
        $r = "";
        if($b) $r.= "0 ";
        else $r .= "1 ";
        $r .= $Proccesses[$i];
        echo $r;
    }
?>
