<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Include your Database connection file
include_once __DIR__ . '/../../../database/dbconfig.php';

// Create database connection instance
$database = new Database();
$db = $database->dbConnection();

// Proxy server URL (Replace with the actual URL where sound data is coming from)
$proxyServerUrl = 'https://aquasense.online/dashboard/admin/controller/soundDevice.php';

// Fetch data from the proxy server
$response = file_get_contents($proxyServerUrl);

if ($response !== false) {
    header('Content-Type: application/json');
    echo $response;

    // Decode the JSON response
    $data = json_decode($response, true);
    error_log(print_r($data, true)); // Debugging output

    // Check if data is in array format and not empty
    if (is_array($data) && !empty($data)) {

        // Prepare SQL insert query
        $insertQuery = "INSERT INTO sound_data (device_id, noise_level, timestamp) VALUES (:device_id, :noise_level, :timestamp)";
        $stmt = $db->prepare($insertQuery);

        foreach ($data as $sound_data) {
            // Extract data for each sound device
            $device_id = $sound_data['DeviceID'] ?? 'N/A';
            $noise_level = $sound_data['dbValue'] ?? 0;
            $timestamp = date("Y-m-d H:i:s");

            // Log data
            error_log("Sound Device: $device_id | Noise Level: $noise_level | Timestamp: $timestamp");

            // Insert into database
            try {
                $stmt->execute([
                    ':device_id'   => $device_id,
                    ':noise_level' => $noise_level,
                    ':timestamp'   => $timestamp
                ]);
                error_log("Data inserted successfully for Device: $device_id");
            } catch (PDOException $e) {
                error_log("Failed to insert data for Device: $device_id | Error: " . $e->getMessage());
            }
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'No valid sound data received from the proxy server']);
        error_log("No valid sound data received from proxy server.");
    }
} else {
    header('Content-Type: application/json');
    echo json_encode([
        'DeviceID' => 'N/A',
        'noise_level' => 0,
        'message' => 'Failed to fetch data from proxy server'
    ]);
    error_log("Failed to fetch data from proxy server: " . error_get_last()['message']);
}
?>
