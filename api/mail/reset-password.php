<?php

require '../init.php';

require 'mail.php';

//require '../get-payload.php';

//$payload_o = getPayload();

if(!empty($_GET['uuid'])) {

    $params_a = [
        'password' => $_GET['uuid'],
        'uuid'     => $_GET['uuid']
    ];

    $sql_s = 'UPDATE k24_member SET password = :password WHERE uuid = :uuid';

    $stmt_o = $pdo_o->prepare($sql_s);

    $stmt_o->execute($params_a);

    $mailBody_s = '<p>Ditt lösenord på <a href="https://korkort24.com/" target="_blank">korkort24.com</a> har nu blivit uppdaterat.</p>'
                . '<p>Ditt nya lösenord är <span style="font-weight: bold;">' . $_GET['uuid'] . '</span>.';

} elseif(!empty($_GET['email'])) {

    $uuid_s = uniqid();

    $params_a = [
        'email' => $_GET['email'],
        'uuid'  => $uuid_s
    ];

    $sql_s = 'UPDATE k24_member SET uuid = :uuid WHERE email = :email';

    $stmt_o = $pdo_o->prepare($sql_s);

    $stmt_o->execute($params_a);

    $mailBody_s = '<p>Hej, någon har begärt att uppdatera ditt lösenord på <a href="https://korkort24.com/" target="_blank">korkort24.com</a>.</p>'
                . '<p>Om det inte är du så kan du bortse från detta mail, ditt lösenord kommer då inte att uppdateras. Om det är du som har begärt att '
                . 'lösenordet ska uppdateras, vänligen klicka <a href="https://korkort24.com/?uuid=' . $uuid_s . '">här</a>.</p>';

    send($_GET['email'], $mailBody_s);

    $data_o = new stdClass();

    $data_o->uuid = $uuid_s;

    $response_o->data = $data_o;
}

$response_o->status = 'ok';

$response_s = json_encode($response_o, JSON_UNESCAPED_UNICODE);

echo $response_s;