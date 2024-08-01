<?php

function put($pdo_o) {

    $stmt_o = $pdo_o->prepare('UPDATE k24_member SET password = :password, uuid = :emptyuuid WHERE uuid = :uuid');

    require '../get-payload.php';

    $payload_o = getPayload();

    $params_a = [
        'password'  => $payload_o->{'password'},
        'uuid'      => $payload_o->{'uuid'},
        'emptyuuid' => ''
    ];

    $stmt_o->execute($params_a);
}