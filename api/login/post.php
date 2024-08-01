<?php

function post($payload_o, $pdo_o) {

    $email_s = $payload_o->{'email'};

    $sql_s = 'SELECT * FROM student WHERE student.email = :email';

    $stmt_o = $pdo_o->prepare($sql_s);

    $stmt_o->execute([':email' => $email_s]);

    $students_a = $stmt_o->fetchAll();

    return $students_a;
}




function postx($payload_a, $db_o) {

    $params_a = [
        'email' => $payload_a['email'] 
    ];

    $table_s = $payload_a['type'];

    $dbQueryResult_o = $db_o->select($table_s, $params_a);

    $emailExists_b = sizeof($dbQueryResult_o->{'data'}) > 0;

    $passwordsMatch_b = false;

    $response_o = new stdClass();

    if($emailExists_b) {

        $user_o = $dbQueryResult_o->{'data'}[0];

        $passwordsMatch_b = $payload_a['password'] === $user_o['password'];

        if($passwordsMatch_b) {

            session_start();

            $_SESSION['id'] = $user_o['id'];
            
            http_response_code(200);

            switch($table_s) {

                case 'student':
        
                    $data_o = new stdClass();
    
                    $data_o->{'firstname'} = $user_o['firstname'];
        
                    $data_o->{'lastname'} = $user_o['lastname'];
        
                    $data_o->{'id'} = $user_o['id'];
    
                    $response_o->{'data'} = $data_o;
    
                    break;
            }
        }
    }

    if(!$passwordsMatch_b) {

        http_response_code(401);

        $error_o = new stdClass();

        $error_o->{'code'} = 401;

        $error_o->{'message'} = 'Incorrect email/password combination';

        $response_o->{'error'} = $error_o;

    }

    return $response_o;
}