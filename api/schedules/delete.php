<?php

function delete($queryParams_a, $db_o) {

    $result_o = $db_o->delete('k24_schedule', $queryParams_a);

    return $result_o;
}