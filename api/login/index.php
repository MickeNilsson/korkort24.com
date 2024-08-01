<?php

require_once '../set-headers.php';

require_once '../activate-error-reporting.php';

require_once '../get-settings.php';

require_once '../init-pdo.php';

setHeaders();

activateErrorReporting();

$settings_a = getSettings();

$pdo_o = initPdo($settings_a);

switch($_SERVER['REQUEST_METHOD']) {

    case 'POST':

        require_once '../get-payload.php';

        $payload_o = getPayload();

        require_once 'post.php';

        $students_a = post($payload_o, $pdo_o);

        if(is_array($students_a)) {

            for($i = 0; $i < count($students_a); ++$i) {

                $student_o = $students_a[$i];

                if($student_o['password'] === $payload_o->{'password'}) {

                    echo json_encode($student_o, JSON_UNESCAPED_UNICODE);

                    exit;
                }
            }
        }

        $errorResponse_o = new stdClass();

        $errorResponse_o->status = 'error';

        $errorResponse_o->error = 'Incorrect username/password combination';
        
        http_response_code(500);
        
        echo json_encode($errorResponse_o, JSON_UNESCAPED_UNICODE);

        break;
}

