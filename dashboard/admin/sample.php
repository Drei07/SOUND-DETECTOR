<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Music Player</title>
</head>
<body>
    <h2>Simple Music Player</h2>
    <audio id="audioPlayer" src="../../src/sounds/keep-silence.mp3" preload="auto"></audio>
    <br>
    <button onclick="playAudio()">Play</button>
    <button onclick="pauseAudio()">Pause</button>
    <input type="range" id="volume" min="0" max="1" step="0.1" onchange="setVolume(this.value)">
    
    <script>
        let audio = document.getElementById("audioPlayer");
        
        function playAudio() {
            audio.play();
        }

        function pauseAudio() {
            audio.pause();
        }

        function setVolume(value) {
            audio.volume = value;
        }
    </script>
</body>
</html>