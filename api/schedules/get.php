<?php

function get($queryParams_a, $db_o) {

    $result_o = $db_o->select('k24_schedule', $queryParams_a);

    return $result_o;
}