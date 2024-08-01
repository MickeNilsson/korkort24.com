<?php

function initPdo($settings_a) {

    $dsn_s = 'mysql:host=' . $settings_a['host'] . ';dbname=' . $settings_a['db'] . ';charset=' . $settings_a['charset'];
    
    $options_a = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false
    ];
    
    try {

        $pdo_o = new PDO($dsn_s, $settings_a['user'], $settings_a['password'], $options_a);

        return $pdo_o;
    
    } catch (\PDOException $error_o) {
    
        $pdoException_o = new \PDOException($error_o->getMessage(), (int)$error_o->getCode());

        return $pdoException_o;
    }
}