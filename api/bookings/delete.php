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
    

    send('mail@mikael-nilsson.se', 'Bokningen med ID ' . $booking['id'] . ' med starttid ' . $start . ' som bokades av ' . $member_a['firstname'] .  ' ' . $member_a['lastname'] . ' med ID ' . $member_a['id'] . ' och e-postadress ' . $member_a['email'] . ' är avbokad.');

    return $result_o;
}