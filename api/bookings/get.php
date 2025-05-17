<?php

function get($queryParams_a, $db_o) {

    $dbQueryResult_o = $db_o->select('k24_booking', $queryParams_a);

    $response_o = new stdClass();

    $response_o = $dbQueryResult_o;

    return $response_o;
}