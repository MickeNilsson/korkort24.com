<?php

require_once '../mail/mail.php';

function delete($queryParams_a, $db_o) {

    $bookingResponse_o = $db_o->select('k24_booking', $queryParams_a);

    $booking = $bookingResponse_o->data[0];

    $memberQueryParams_a = ['id' => $booking['member_id']];
    $response_o = $db_o->select('k24_member', $memberQueryParams_a);
    $member_a = $response_o->data[0];

    $result_o = $db_o->delete('k24_booking', $queryParams_a);

    //print_r($queryParams_a);

    //$queryParams_a = ['id' => $queryParams_a];

    $date = new DateTime($booking['start']);
    $formatter = new IntlDateFormatter('sv_SE', IntlDateFormatter::FULL, IntlDateFormatter::SHORT);
    $start = ucfirst($formatter->format($date));
    
    $messageToAdmin_s = 'Bokningen med ID <strong>' . $booking['id'] . '</strong> med starttid <strong>' . $start . '</strong> som bokades av <strong>' . $member_a['firstname'] .  ' ' . $member_a['lastname'] . '</strong> med ID <strong>' . $member_a['id'] . '</strong> och e-postadress <strong>' . $member_a['email'] . '</strong> är avbokad.';
    
    $mails_a = [
        [
            'address' => 'mail@mikael-nilsson.se',
            'message' => $messageToAdmin_s
        ],
        [
            'address' => 'johan.gardelin@hotmail.se',
            'message' => $messageToAdmin_s
        ]
    ];
    
    send($mails_a);

    return $result_o;
}