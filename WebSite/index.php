<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- <link rel="stylesheet" href="style.css"> -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4="crossorigin="anonymous"></script>
    <title>Easy AAUP</title>
</head>
<body>
    <div id = "layout-wrapper">
        <form action="index.php" method="GET">
            <input type="text" name="user" id="user" placeholder="Username">
            <input type="password" name="pass" id="pass" placeholder="Password"><br>
            <input type="submit" name="submit" id="submit">
        </form>
    </div>


    <?php
    $arr = array();
    if(isset($_GET['submit'])){
        ob_implicit_flush(true);ob_end_flush();
        $command = "python3 ../Python/Scrapper.py ".$_GET["user"]." ".$_GET["pass"];
        $fp=popen($command,"r");
        while (!feof($fp)) {
            $buffer = fgets($fp, 4096);
            echo "$buffer <br>";
        }
        pclose($fp);
    }
    ?>
</body>
</html>
