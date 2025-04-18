<?php

header('Access-Control-Allow-Origin: *');

header('Access-Control-Allow-Methods: DELETE, GET, POST, PUT');

header('Access-Control-Allow-Headers: Content-Type, Origin, X-Auth-Token');

header('Content-Type: application/json; charset=utf-8');

// Only allow GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['error' => 'Only GET requests are allowed.']);
    exit;
}

// Path to the JSON file
$jsonFile = __DIR__ . '/quiz.json';

// Check if the file exists
if (!file_exists($jsonFile)) {
    http_response_code(404); // Not Found
    echo json_encode(['error' => 'JSON file not found.']);
    exit;
}

// Read the file contents
$jsonData = file_get_contents($jsonFile);

// Validate JSON
if (json_decode($jsonData) === null && json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(500); // Internal Server Error
    echo json_encode(['error' => 'Invalid JSON in data file.']);
    exit;
}

// Return the JSON data
echo $jsonData;