<?php

function post($payload_a, $db_o) {

    file_put_contents('teori.json', json_encode($payload_a, JSON_UNESCAPED_UNICODE));

    $result_o = new stdClass();

    $result_o->{'result'} = 'ok';

    return $result_o;
}