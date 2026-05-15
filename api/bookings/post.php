<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once '../mail/mail.php';

function post($payload_o, $db_o) {

    $params_a = [
        'schedule_id' => $payload_o->{'schedule_id'},
        'member_id' => $payload_o->{'member_id'},
        'cancelled' => false,
        'start' => $payload_o->{'start'},
        'end' => $payload_o->{'end'}
    ];

    //'start' => date('Y-m-d H:i:s', strtotime($payload_a['start'])),
    //'end' => date('Y-m-d H:i:s', strtotime($payload_a['end']))

    $result_o = $db_o->insertInto('k24_booking', $params_a);

    $queryParams_a = ['id' => $payload_o->{'schedule_id'}];
    $response_o = $db_o->select('k24_schedule', $queryParams_a);
    $schedule_a = $response_o->data[0];

    $queryParams_a = ['id' => $payload_o->{'member_id'}];
    $response_o = $db_o->select('k24_member', $queryParams_a);
    $member_a = $response_o->data[0];

    $date = new DateTime($payload_o->{'start'});
    $formatter = new IntlDateFormatter('sv_SE', IntlDateFormatter::FULL, IntlDateFormatter::SHORT);
    $start = ucfirst($formatter->format($date));
    //print_r($member);

    $message_s = '<strong>' . $member_a['firstname'] .  ' ' . $member_a['lastname'] . '</strong> med ID <strong>' . $member_a['id'] . '</strong> och e-postadress <strong>' . $member_a['email'] . '</strong> har bokat en tid som startar <strong>' . $start . '</strong> och är <strong>' . $schedule_a['duration'] . '</strong> minuter lång.';

    $mails_a = [
        [
            'address' => 'mail@mikael-nilsson.se',
            'message' => $message_s
        ],
        [
            'address' => 'johan.gardelin@hotmail.se',
            'message' => $message_s
        ]
    ];

    send($mails_a);
    //send('mail@mikael-nilsson.se',  $member_a['firstname'] .  ' ' . $member_a['lastname'] . ' med ID ' . $member_a['id'] . ' och e-postadress ' . $member_a['email'] . ' har bokat en tid som startar ' . $start . '.');
    //send('mikaelnilsson1973@hotmail.com',  $member_a['firstname'] .  ' ' . $member_a['lastname'] . ' med ID ' . $member_a['id'] . ' och e-postadress ' . $member_a['email'] . ' har bokat en tid som startar ' . $start . '.');

    return $result_o;
}