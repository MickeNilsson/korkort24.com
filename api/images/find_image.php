<?php

$fileNames_a = glob($_GET['name'] . '.*');

if(sizeof($fileNames_a) === 0) {

    header('Location: default.png');

} else {

    header('Location: ' . $fileNames_a[0]);
}