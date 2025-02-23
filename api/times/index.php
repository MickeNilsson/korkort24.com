<?php

require '../error-reporting.php';

require '../get-payload.php';

require '../headers.php';

switch($_SERVER['REQUEST_METHOD']) {

    case 'GET':

        $times_s = file_get_contents('./times.json');

        echo $times_s;

        break;

    case 'POST':

        $payload_o = getPayload();

        file_put_contents('./times.json', json_encode($payload_o, JSON_UNESCAPED_UNICODE));

        echo '{"status": "ok"}';
        
        break;

    case 'PUT':

        $payload_o = getPayload();

        $times_s = file_get_contents('./times.json');

        $times_a = json_decode($times_s);

        foreach ($times_a as $key => $time_o) {
            if($time_o->{'id'} === $payload_o->{'timeid'}) {
                $time_o->{'studentid'} = $payload_o->{'studentid'};
            }
        }

        file_put_contents('./times.json', json_encode($times_a, JSON_UNESCAPED_UNICODE));

        echo '{"status": "ok"}';
}