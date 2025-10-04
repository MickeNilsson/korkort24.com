<?php

function post($payload_o, $db_o) {

    $result_o = $db_o->insertInto('k24_educationcard', (array)$payload_o);

    return $result_o;    
}