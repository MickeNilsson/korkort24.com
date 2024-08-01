<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');
header('Content-Type: application/json; charset=utf-8');

ini_set('display_errors', 1);
//move_uploaded_file($_FILES['image']['tmp_name'], '../../images/' . $_POST['name']);

//echo $_SERVER['REQUEST_METHOD'];

switch($_SERVER['REQUEST_METHOD']) {

    case 'DELETE':
        unlink('../../images/' . $_GET['name']); echo '{"status": "ok"}';
        break;
    case 'POST':
        unlink('../../images/' . $_POST['name']);
        move_uploaded_file($_FILES['image']['tmp_name'], '../../images/' . $_POST['name']);
        $jumpOutOfLoopCounter_i = 10;
        /*while(!file_exists('../../images/' . $_POST['name'])) {
            sleep(1);
            if(--$jumpOutOfLoopCounter_i < 1) {
                exit;
            }
        } */
        sleep(2);
        echo '{"status": ' . $jumpOutOfLoopCounter_i . '}';
        break;
}


// switch($_SERVER['REQUEST_METHOD']) {
//     case 'POST': move_uploaded_file($_FILES['image']['tmp_name'], '../../images/' . $_POST['name']); break;
//     case 'DELETE': unlink('../../images/' . $_GET['name']); break
// }