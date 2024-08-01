<?php

/**
 * Returns payload in PHP object format
 * 
 * If payload don't exist or is malformed false is returned
 */
function getPayload() {

    $payload_s = file_get_contents('php://input');

    $payload_o = json_decode($payload_s);
    
    if(is_null($payload_o)) {
    
        return false;
    }

    return $payload_o;
}
