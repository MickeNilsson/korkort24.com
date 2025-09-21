<?php

function put($payload_o, $db_o, $id_s) {

    $result_o = $db_o->update('k24_educationcard', $payload_o, intval($id_s));

    return $result_o;    
}