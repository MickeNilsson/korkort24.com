<?php

require_once '../mail/mail.php';

function post($pdo_o) {

    $payload_o = getPayload();

    $sql_s = 'SELECT email FROM k24_member WHERE email = :email';

    $stmt_o = $pdo_o->prepare($sql_s);

    $params_a = [
        'email' => $payload_o->{'email'}
    ];

    $stmt_o->execute($params_a);

    $data_a = array();

    while($row_o = $stmt_o->fetch()) {

        array_push($data_a, $row_o);
    }

    $response_o = new stdClass();

    if(count($data_a) === 0) {

        $params_a = [
            'email'     => $payload_o->{'email'},
            'firstname' => $payload_o->{'firstname'},
            'lastname'  => $payload_o->{'lastname'},
            'password'  => $payload_o->{'password'},
            'uuid'      => generate_short_id()
        ];

        $sql_s = 'INSERT INTO k24_member (email, firstname, lastname, password, uuid) ' 
               . 'VALUES (:email, :firstname, :lastname, :password, :uuid)';

        $stmt_o = $pdo_o->prepare($sql_s);

        $stmt_o->execute($params_a);

        $response_o->{'id'} = $pdo_o->lastInsertId();

        $messageToMember_s = '<p>Hej ' . $payload_o->{'firstname'} . '!</p><p>För att aktivera ditt konto på Korkort24, vänligen klicka på denna aktiveringslänk: <a href="https://korkort24.com/api/members/activate.php?id=' . $params_a['uuid'] . '">korkort24.com/activate</a> </p><br><br>Med vänliga hälsningar Körkort24';

        //send($payload_o->{'email'},  $mail);

        $messageToAdmin_s = '<p>En ny medlem har registrerat ett konto på korkort24.com.</p><p><strong>Datum:</strong> ' . date(DATE_RFC2822) . '</p><p><strong>Förnamn:</strong> ' . $payload_o->{'firstname'} . '</p>'
                   . '<p><strong>Efternamn:</strong> ' . $payload_o->{'lastname'} . '</p><p><strong>E-post:</strong> ' . $payload_o->{'email'} . '</p>';

        $mails_a = [
            [
                'address' => 'mail@mikael-nilsson.se',
                'message' => $messageToAdmin_s
            ],
            [
                'address' => 'johan.gardelin@hotmail.se',
                'message' => $messageToAdmin_s
            ],
            [
                'address' => $payload_o->{'email'},
                'message' => $messageToMember_s
            ]
        ];

        // [
        //         'address' => 'johan.gardelin@hotmail.se',
        //         'message' => $message_s
        //     ]

        send($mails_a);

    } else {

        $response_o->{'error'} = 'E-mail already exists';
    }

    return $response_o;
}

function generate_short_id($length = 20) {
    $data = random_bytes(16);
    
    // Sätt version 4 och variant RFC 4122
    $data[6] = chr(ord($data[6]) & 0x0f | 0x40);
    $data[8] = chr(ord($data[8]) & 0x3f | 0x80);

    // Gör om till hex och korta ner
    return substr(bin2hex($data), 0, $length);
}