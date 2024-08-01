<?php

function post($payload_a, $db_o) {

    $params_a = [
        'from_datetime' => date('Y-m-d H:i:s', strtotime($payload_a['from_datetime'])),
        'to_datetime' => date('Y-m-d H:i:s', strtotime($payload_a['to_datetime']))
    ];

    $result_o = $db_o->insertInto('schedule', $params_a);

    return $result_o;
}