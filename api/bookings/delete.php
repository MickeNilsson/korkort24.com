<?php

function delete($queryParams_a, $db_o) {

    $result_o = $db_o->delete('k24_booking', $queryParams_a);

    return $result_o;
}