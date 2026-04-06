<?php

// header('Access-Control-Allow-Origin: *');
// header('Access-Control-Allow-Methods: POST');
// header('Access-Control-Allow-Headers: Content-Type');
// header('Content-Type: application/json; charset=utf-8');

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once 'mail.php';

send('mail@mikael-nilsson.se', 'Här är mailet');

// $headers_s = 'Content-Type: text/html; charset=utf-8' . "\r\n"
//            . 'From: Web site <mikael@mikael-nilsson.se>';
// $sendStatus_b = mail('mikaelnilsson1973@hotmail.com', 'Meddelande från formuläret på mikael-nilsson.se',  $_POST['message'], $headers_s);
// $response_aa = [
//     'status' => 'ok'
// ];
// echo json_encode($response_aa, JSON_UNESCAPED_UNICODE);