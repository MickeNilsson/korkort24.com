<?php

// header('Access-Control-Allow-Origin: *');

// header('Access-Control-Allow-Methods: DELETE, GET, POST, PUT');

// header('Access-Control-Allow-Headers: Content-Type, Origin, X-Auth-Token');

// header('Content-Type: application/json; charset=utf-8');

require '../init.php';

$stmt_o = $pdo_o->prepare('UPDATE k24_member SET confirmed = :confirmed WHERE uuid = :uuid');

//require '../get-payload.php';

//$payload_o = getPayload();

$params_a = [
    'confirmed' => 1,
    'uuid'      => $_GET['id']
];

$stmt_o->execute($params_a);

header('Location: /?acc_conf=true');
//echo $_GET['id'];