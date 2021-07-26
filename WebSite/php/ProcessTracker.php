<?php
    #loops the number of times of process and cheks each process
    #the i var stands for the number of processes
    #the j var stands for the start head index
    for($i = 0, $j = 2; $i < 2; $i++, $j+=2){
        $r = Process($Fname, $j, $j - 2);
        Report($r, $i);
        if($r)
            die;
    }
?>

<?php
    function Report($b, $i){ #fot testing for now no more
        $Proccesses = array("Connection", "Login");
        $r = "";
        if($b) $r .= "[-] ";
        else $r .= "[+] ";
        $r .= $Proccesses[$i];
        echo $r;
    }
?>
