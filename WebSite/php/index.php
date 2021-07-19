<?php
    // session_start();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../css/style.css">
    <title>Easy AAUP</title>
</head>
<body>
    <div class="animation-area">
		<ul class="box-area">
			<li></li>
			<li></li>
			<li></li>
			<li></li>
			<li></li>
			<li></li>
		</ul>
	</div>
    <div id="layout-wrapper">
        <!-- <p id="title">Login</p> -->
        <div id="login-form-wrapper">
            <p id="title">Login</p>
            <form class="wrapper" action="index.php" method="GET">
                <div class="input-data">
                    <div id="user-input">
                        <input type="text" name="user" id="user" required>
                        <div class="underline"></div>
                        <label>name</label>
                    <div id="pass-input">
                        <input type="password" name="pass" id="pass" required>
                        <div class="underline"></div>
                        <label>password</label>
                    </div>
                </div>
                <!-- <input type="checkbox" id="remember-me" name="remember-me">
                <label for="remember">Remember me</label> -->
                <div id="submit-btn">
                <input type="submit" name="submit" id="submit">
                </div>
            </form>
        </div>
    </div>
</body>
</html>
<?php
        if(isset($_GET['submit'])){
            $Fname = "Output.text";
            system('python3 ../python/Scrapper.py '.$_GET['user']. ' '. $_GET["pass"].
            ' > '.$Fname. ' 2>&1 &');
            require('login.php');
            // login($Fname);
        }
?>