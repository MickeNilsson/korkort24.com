<?php

function post($quiz_o, $db_o) {

	if(isset($quiz_o->{'delete'})) {

		unset($quiz_o->{'delete'});

		file_put_contents('./quiz.json', json_encode($quiz_o, JSON_UNESCAPED_UNICODE));

	} else {

		$savedQuiz_s = file_get_contents('./quiz.json');

		$savedQuiz_o = new stdClass();
		
		if($savedQuiz_s) {
		
			$savedQuiz_o = json_decode($savedQuiz_s);
		}

		foreach($quiz_o as $sectionName_s => $section_o) {
		
			if(!isset($savedQuiz_o->{$sectionName_s})) {
				$savedQuiz_o->{$sectionName_s} = new stdClass();
			}
			
			foreach($section_o as $question_s => $question_o) {
				$question_o->{'id'} = uniqidReal();
				$savedQuiz_o->{$sectionName_s}->{$question_s} = $question_o;
			}
		}
		
		file_put_contents('./quiz.json', json_encode($savedQuiz_o, JSON_UNESCAPED_UNICODE));
	}
	
	$response_o = new stdClass();

	$response_o->{'status'} = 'ok';

	return $response_o;
}

function uniqidReal() {
	// uniqid gives 13 chars, but you could adjust it to your needs.
	if (function_exists("random_bytes")) {
		$bytes = random_bytes(ceil(5));
	} elseif (function_exists("openssl_random_pseudo_bytes")) {
		$bytes = openssl_random_pseudo_bytes(ceil(5));
	} else {
		throw new Exception("no cryptographically secure random function available");
	}
	return substr(bin2hex($bytes), 0, 10);
}
