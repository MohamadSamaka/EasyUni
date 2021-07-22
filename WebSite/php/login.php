<?php
    function login($F){
        $arr = array();
        while(count($arr) < 4){
            $arr = array_filter(explode("|",file_get_contents($F)));
        }
        print_r($arr);
    }
?>