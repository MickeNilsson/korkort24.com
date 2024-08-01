<?php

function post($payload_a, $db_o) {

    $params_a = [
        'schedule_id' => $payload_a['schedule_id'],
        'student_id' => $payload_a['student_id'],
        'cancelled' => false,
        'from_datetime' => date('Y-m-d H:i:s', strtotime($payload_a['from_datetime'])),
        'to_datetime' => date('Y-m-d H:i:s', strtotime($payload_a['to_datetime']))
    ];

    $result_o = $db_o->insertInto('booking', $params_a);

    return $result_o;
}