// PH LEVEL GAUGE
am5.ready(function () {
    var SoundSensorDevice1Gauge = am5.Root.new("SoundSensorDevice1");

    // Set themes
    SoundSensorDevice1Gauge.setThemes([
        am5themes_Animated.new(SoundSensorDevice1Gauge)
    ]);

    // Create SoundSensorDevice1 chart
    var SoundSensorDevice1chart = SoundSensorDevice1Gauge.container.children.push(am5radar.RadarChart.new(SoundSensorDevice1Gauge, {
        panX: false,
        panY: false,
        startAngle: 160,
        endAngle: 380
    }));

    // Create axis and its renderer
    var SoundSensorDevice1axisRenderer = am5radar.AxisRendererCircular.new(SoundSensorDevice1Gauge, {
        innerRadius: -40
    });

    SoundSensorDevice1axisRenderer.grid.template.setAll({
        stroke: SoundSensorDevice1Gauge.interfaceColors.get("background"),
        visible: true,
        strokeOpacity: 1
    });

    var SoundSensorDevice1xAxis = SoundSensorDevice1chart.xAxes.push(am5xy.ValueAxis.new(SoundSensorDevice1Gauge, {
        maxDeviation: 0,
        min: 0,
        max: 120,
        strictMinMax: true,
        renderer: SoundSensorDevice1axisRenderer
    }));

    // Add clock hand
    var SoundSensorDevice1axisDataItem = SoundSensorDevice1xAxis.makeDataItem({});
    var SoundSensorDevice1clockHand = am5radar.ClockHand.new(SoundSensorDevice1Gauge, {
        pinRadius: am5.percent(25),
        radius: am5.percent(65),
        bottomWidth: 30
    });

    var SoundSensorDevice1bullet = SoundSensorDevice1axisDataItem.set("bullet", am5xy.AxisBullet.new(SoundSensorDevice1Gauge, {
        sprite: SoundSensorDevice1clockHand
    }));

    SoundSensorDevice1xAxis.createAxisRange(SoundSensorDevice1axisDataItem);

    var SoundSensorDevice1label = SoundSensorDevice1chart.radarContainer.children.push(am5.Label.new(SoundSensorDevice1Gauge, {
        fill: am5.color(0xffffff),
        centerX: am5.percent(50),
        textAlign: "center",
        centerY: am5.percent(50),
        fontSize: "1.3em"
    }));

    SoundSensorDevice1axisDataItem.set("value", 0);

    SoundSensorDevice1bullet.get("sprite").on("rotation", function () {
        var value = SoundSensorDevice1axisDataItem.get("value");
        var fill = am5.color(0x000000);
        SoundSensorDevice1xAxis.axisRanges.each(function (range) {
            if (value >= range.get("value") && value <= range.get("endValue")) {
                fill = range.get("axisFill").get("fill");
            }
        });

        SoundSensorDevice1label.set("text", Math.round(value).toString());

        SoundSensorDevice1clockHand.pin.animate({
            key: "fill",
            to: fill,
            duration: 500,
            easing: am5.ease.out(am5.ease.cubic)
        });
        SoundSensorDevice1clockHand.hand.animate({
            key: "fill",
            to: fill,
            duration: 500,
            easing: am5.ease.out(am5.ease.cubic)
        });
    });

    // Variables for animation control
    var SoundSensorDevice1current = 0;
    var SoundSensorDevice1target = 0;
    var SoundSensorDevice1animationStartTime = performance.now(); // Timestamp to track animation start time
    var SoundSensorDevice1animationDuration = 1000; // Duration for smooth animation (in milliseconds)

    // Function to update the gauge with smooth animation
    function SoundSensorDevice1Update(level) {
        var parsed = parseFloat(level);
        if (!isNaN(parsed)) {
            SoundSensorDevice1target = parsed;

            function animate() {
                if (Math.abs(SoundSensorDevice1current - SoundSensorDevice1target) < 0.5) {
                    SoundSensorDevice1current = SoundSensorDevice1target; // Prevents tiny oscillations
                } else {
                    // Smooth step interpolation
                    SoundSensorDevice1current += (SoundSensorDevice1target - SoundSensorDevice1current) * 0.1;
                    SoundSensorDevice1axisDataItem.set("value", Number(SoundSensorDevice1current.toFixed(0)));

                    requestAnimationFrame(animate);
                }
            }

            requestAnimationFrame(animate);
        } else {
            console.error('Invalid SoundSensorDevice1 level:', level);
        }
    }

    // Setup WiFi status check and monitoring
    function SoundSensorDevice1setupWiFiStatusCheckAndEnableMonitoring() {
        function updateWifiStatus() {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (xhr.status === 200) {
                        var data = JSON.parse(xhr.responseText);
                        var wifiStatusElement = document.getElementById('wifi_status');
                        if (wifiStatusElement) {
                            wifiStatusElement.innerText = data.wifi_status;
                            wifiStatusElement.style.color = (data.wifi_status.toLowerCase() === 'connected') ? 'green' : 'red';
                        }
                    } else {
                        console.error("WiFi status update failed");
                    }
                }
            };
            xhr.open('POST', 'controller/receive_data.php', true);
            xhr.send();
        }

        function SoundSensorDevice1LevelFetchData() {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                    var data = JSON.parse(xhr.responseText);
        
                    // Extract dB values per device
                    var soundDevice1 = data.find(device => device.DeviceID === "DEVICE1")?.dbValue || "N/A";
        
                    // Update UI elements
                    document.getElementById('soundDevice1').textContent = soundDevice1 + " dB";
        
                    // Call functions to process the values if necessary
                    SoundSensorDevice1Update(soundDevice1);
                }
            };
        
            xhr.open('POST', 'controller/receive_data.php', true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify({}));
        }
        
        // Initial fetch and setup for periodic updates
        SoundSensorDevice1LevelFetchData();
        setInterval(SoundSensorDevice1LevelFetchData, 500);
        updateWifiStatus();
    }

    // Call the setup function
    SoundSensorDevice1setupWiFiStatusCheckAndEnableMonitoring();

    // Create axis ranges bands for soil moisture sensor (0-1000)
    var SoundSensorDevice1bandsData = [{
        title: "Very Quiet",
        color: "#6699ff", // Light Blue
        lowScore: 0,
        highScore: 20
    }, {
        title: "Quiet",
        color: "#b0d136", // Light Green
        lowScore: 20,
        highScore: 40
    }, {
        title: "Moderate",
        color: "#f3eb0c", // Yellow
        lowScore: 40,
        highScore: 60
    }, {
        title: "Loud",
        color: "#fdae19", // Orange
        lowScore: 60,
        highScore: 80
    }, {
        title: "Very Loud",
        color: "#f04922", // Red
        lowScore: 80,
        highScore: 100
    }, {
        title: "Extremely Loud",
        color: "#f02222", // Red
        lowScore: 100,
        highScore: 120
    }];
    
    

    am5.array.each(SoundSensorDevice1bandsData, function (data) {
        var range = SoundSensorDevice1xAxis.createAxisRange(SoundSensorDevice1xAxis.makeDataItem({}));
        range.setAll({
            value: data.lowScore,
            endValue: data.highScore
        });
        range.get("axisFill").setAll({
            visible: true,
            fill: am5.color(data.color),
            fillOpacity: 0.8
        });
        range.get("label").setAll({
            text: data.title,
            inside: true,
            radius: 15,
            fontSize: "9px",
            fill: SoundSensorDevice1Gauge.interfaceColors.get("background")
        });
    });

    // Make chart animate on load
    SoundSensorDevice1chart.appear(1000, 100);
});
