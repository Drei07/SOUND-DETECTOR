<?php
include_once 'header.php';
?>
<!DOCTYPE html>
<html lang="en">

<head>
	<?php echo $header_dashboard->getHeaderDashboard() ?>
	<link href='https://fonts.googleapis.com/css?family=Antonio' rel='stylesheet'>
	<title>Dashboard</title>
</head>

<body>

	<!-- Loader -->
	<div class="loader"></div>

	<!-- SIDEBAR -->
	<?php echo $sidebar->getSideBar(); ?> <!-- This will render the sidebar -->
	<!-- SIDEBAR -->



	<!-- CONTENT -->
	<section id="content">
		<!-- NAVBAR -->
		<nav>
			<i class='bx bx-menu'></i>
			<form action="#">
				<div class="form-input">
					<button type="submit" class="search-btn"><i class='bx bx-search'></i></button>
				</div>
			</form>
			<div class="username">
				<span>Hello, <label for=""><?php echo $user_fname ?></label></span>
			</div>
			<a href="profile" class="profile" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Profile">
				<img src="../../src/img/<?php echo $user_profile ?>">
			</a>
		</nav>
		<!-- NAVBAR -->

		<!-- MAIN -->
		<main>
			<div class="head-title">
				<div class="left">
					<h1>Dashboard</h1>
					<ul class="breadcrumb">
						<li>
							<a class="active" href="./">Home</a>
						</li>
						<li>|</li>
						<li>
							<a href="">Dashboard</a>
						</li>
					</ul>
				</div>
			</div>

			</div>
			<ul class="dashboard_data">
				<div class="gauge_dashboard">
					<div class="status">
						<div class="card arduino">
							<h1>SOUND SENSOR 1 STATUS</h1>
							<div class="sensor-data">
								<audio id="audioPlayer" src="../../src/sounds/keep-silence.mp3" preload="auto"></audio>
								<span id="soundDevice1">Loading...</span>
							</div>
						</div>
					</div>
					<div class="gauge">
						<div class="card gauge_card">
							<p class="card-title">SOUND SENSOR 1 VALUE</p>
							<div id="SoundSensorDevice1"></div>
						</div>
					</div>
				</div>
			</ul>
		</main>
		<!-- MAIN -->
	</section>
	<!-- CONTENT -->

	<?php echo $footer_dashboard->getFooterDashboard() ?>
	<?php include_once '../../config/sweetalert.php'; ?>
	<script src="../../src/js/gauge.js"></script>
    
	<script>
    let audio = document.getElementById("audioPlayer");

    function checkSoundLevel() {
        let soundValue = parseFloat(document.getElementById("soundDevice1").innerText);

        if (!isNaN(soundValue) && soundValue >= 90) {
            if (audio.paused) { // Play only if it's not already playing
                audio.play();
            }
        }
    }

    // Check sound level every second
    setInterval(checkSoundLevel, 1000);
</script>

</body>

</html>