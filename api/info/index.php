<?php

require_once '../headers.php';

require_once '../init-pdo.php';

require_once '../settings.php';

$pdo_o = initPdo($settings_a);

switch($_SERVER['REQUEST_METHOD']) {

    case 'GET':

        $category_i = 1;

        $sql_s = 'SELECT * FROM k24_info WHERE k24_info.category = :category';
    
        $stmt_o = $pdo_o->prepare($sql_s);
    
        $stmt_o->execute([':category' => $category_i]);
    
        $info_a = $stmt_o->fetchAll();
    
        echo json_encode($info_a, JSON_UNESCAPED_UNICODE);

        break;
}