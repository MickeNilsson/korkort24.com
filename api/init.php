<?php

require 'error-reporting.php';

require 'get-payload.php';

require 'headers.php';

require 'settings.php';

require 'init-pdo.php';

$pdo_o = initPdo($settings_a);

$response_o = new stdClass();