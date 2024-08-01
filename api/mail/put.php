<?php

function put($pdo_o) {

    require '../get-payload.php';

    $payload_o = getPayload();

    if(count($data_a) === 0) {

        $params_a = [
            'email'     => $payload_o->{'email'},
            'firstname' => $payload_o->{'firstname'},
            'lastname'  => $payload_o->{'lastname'},
            'password'  => $payload_o->{'password'}
        ];

        $sql_s = 'INSERT INTO k24_member (email, firstname, lastname, password) ' 
               . 'VALUES (:email, :firstname, :lastname, :password)';

        $stmt_o = $pdo_o->prepare($sql_s);

        $stmt_o->execute($params_a);

        $response_o->{'id'} = $pdo_o->lastInsertId();

    } else {

        $response_o->{'error'} = 'E-mail already exists';
    }

    return $response_o;
}