<?php

function get($queryParams_a, $db_o) {

    $dbQueryResult_o = $db_o->select('student', $queryParams_a);

    $emailExists_b = sizeof($dbQueryResult_o->{'data'}) > 0;

    return $result_o;
}