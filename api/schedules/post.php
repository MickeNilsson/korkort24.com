<?php

function post($payload_o, $db_o) {

    $params_a = [
        'date' => $payload_o->{'date'},
        'timespan' => $payload_o->{'timespan'}
    ];

    $result_o = $db_o->insertInto('k24_schedule', $params_a);

    return $result_o;
}