<?php

function callEndpoint($endpoint_s) {

    require 'headers.php';

    require 'error-reporting.php';

    require 'settings.php';

    require 'init-pdo.php';

    $db_o = initPdo($settings_a);

    switch($_SERVER['REQUEST_METHOD']) {

        case 'GET':
    
            require __DIR__ . '/' . $endpoint_s . '/get.php';
            
            $result_o = get($_GET, $db_o);
            
            break;
            
        case 'POST':
    
            require 'get-payload.php';

            require __DIR__ . '/' . $endpoint_s . '/post.php';

            $payload_o = getPayload();

            $result_o = post($payload_o, $db_o);

            break;
    
        case 'PUT':

            require 'get-payload.php';

            require './' . $endpoint_s . '/put.php';

            $payload_o = getPayload();

            $result_o = post($payload_o, $db_o);

            $response_s = post();
            
            break;
    }
    
    $result_s = json_encode($result_o, JSON_UNESCAPED_UNICODE);
    
    echo $result_s;
}




