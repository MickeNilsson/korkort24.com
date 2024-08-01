<?php

function get() {

    /* $result_o = new stdClass();

    $result_o->{'result'} = 'ok'; */

    $quiz_o = json_decode(file_get_contents('./quiz.json'));
    
    return $quiz_o;
}