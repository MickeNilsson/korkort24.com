<?php

require 'get.php';

require '../init.php';

$response_o->{'data'} = get();

http_response_code(200);

$response_o->{'status'} = 'ok';

$response_s = json_encode($response_o, JSON_UNESCAPED_UNICODE);

echo $response_s;