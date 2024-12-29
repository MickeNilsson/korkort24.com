<?php



//require 'get.php';


require '../init.php';

switch($_SERVER['REQUEST_METHOD']) {

    case 'GET': 
        
        $quiz_o = json_decode(file_get_contents('./quiz.json')); 
        
        $response_o->{'data'} = $quiz_o;

        break;

    case 'POST': 
        
        $quiz_o = getPayload();

        file_put_contents('./quiz.json', json_encode($quiz_o, JSON_UNESCAPED_UNICODE));
        
        break;
}

http_response_code(200);

$response_o->{'status'} = 'ok';

$response_s = json_encode($response_o, JSON_UNESCAPED_UNICODE);

echo $response_s;





// $response_o->{'data'} = get();

// http_response_code(200);

// $response_o->{'status'} = 'ok';

// $response_s = json_encode($response_o, JSON_UNESCAPED_UNICODE);

// echo $response_s;