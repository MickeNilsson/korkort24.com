<?php

require_once '../init.php';

require_once '../mail/mail.php';

$stmt_o = $pdo_o->prepare('SELECT * FROM k24_member WHERE id = :id');

//require '../get-payload.php';

//$payload_o = getPayload();

$params_a = [
    'id' => $_GET['id']
];

$stmt_o->execute($params_a);

$row_a = $stmt_o->fetch();

if($row_a['confirmed'] === 0) {

    $mail = '<p>Hej ' . $row_a['firstname'] . '!</p><p>För att aktivera ditt konto på Korkort24, vänligen klicka på denna aktiveringslänk: <a href="https://korkort24.com/api/members/activate.php?id=' . $row_a['uuid'] . '">korkort24.com/activate</a> </p><br><br>Med vänliga hälsningar Körkort24';

    //send('mail@mikael-nilsson.se',  $mail);

    send($row_a['email'],  $mail);
}



print_r($row_a);