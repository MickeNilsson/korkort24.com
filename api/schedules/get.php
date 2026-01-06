<?php

function get($queryParams_a, $db_o) {

    $fromDate_s = $queryParams_a['fromDate'];

    $toDate_s = $queryParams_a['toDate'];

    $result_o = $db_o->selectSchedules($fromDate_s, $toDate_s);

    return $result_o;
}