<?php

require '../init.php';

switch($_SERVER['REQUEST_METHOD']) {

    case 'GET': 
        
        require 'get.php';

        http_response_code(200);

        $response_o->{'data'} = get($pdo_o); 
        
        break;

    case 'POST': 
        
        require 'post.php';

        $result_o = post($pdo_o); 
        
        if(empty($result_o->{'id'})) {

            http_response_code(409);

            $response_o->{'error'} = $result_o->{'error'};

        } else {

            http_response_code(201);

            $response_o->{'data'} = $result_o;
        }

        break;

    case 'PUT': 
        
        require 'put.php';

        put($pdo_o); 
        
        http_response_code(200);
        
        break;
}

$response_o->status = 'ok';

$response_s = json_encode($response_o, JSON_UNESCAPED_UNICODE);

echo $response_s;