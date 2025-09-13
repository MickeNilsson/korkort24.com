<?php

function get($queryParams_a, $db_o) {

    $result_o = $db_o->select('k24_educationcard', $queryParams_a);

    return $result_o;
}