<?php

function post($payload_o, $db_o) {

    $params_a = [
        'from' => $payload_o->{'from'},
        'to' => $payload_o->{'to'}
    ];

    $result_o = $db_o->insertInto('k24_schedule', $params_a);

    return $result_o;
}