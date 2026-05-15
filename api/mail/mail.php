<?php
//Import PHPMailer classes into the global namespace
//These must be at the top of your script, not inside a function
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

// header('Access-Control-Allow-Origin: *');
// header('Access-Control-Allow-Methods: POST');
// header('Access-Control-Allow-Headers: Content-Type');
// header('Content-Type: application/json; charset=utf-8');


// $mail_o = new PHPMailer(true);
// $mail_o->isSMTP();                                            //Send using SMTP
// $mail_o->Host     = $mailSettings_a['host'];                     //Set the SMTP server to send through
// $mail_o->SMTPAuth = true;                                   //Enable SMTP authentication
// $mail_o->Username = $mailSettings_a['username'];                     //SMTP username
// $mail_o->Password = $mailSettings_a['password'];                               //SMTP password
// $mail_o->Port     = $mailSettings_a['port'];                                    //TCP port to connect to; use 587 if you have set `SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS`
// $mail_o->CharSet  = $mailSettings_a['charset'];
// $mail_o->setFrom('noreply@korkort24.com', 'Körkort24');
// $mail_o->isHTML(true);                                  //Set email format to HTML

//Create an instance; passing `true` enables exceptions
//$mail_o = new PHPMailer(true);

function send($mails_a) {



    //global $mail_o;
    //$mail_o = new PHPMailer(true);
    //global $mailSettings_a;
    

    try {

        require_once 'PHPMailer.php';
        require_once 'SMTP.php';
        require_once 'Exception.php';
        require_once 'mail-settings.php';
        
   

        $mail_o = new PHPMailer(true);
        $mail_o->isSMTP();                                            //Send using SMTP
        $mail_o->Host     = $mailSettings_a['host'];                     //Set the SMTP server to send through
        $mail_o->SMTPAuth = true;                                   //Enable SMTP authentication
        $mail_o->Username = $mailSettings_a['username'];                     //SMTP username
        $mail_o->Password = $mailSettings_a['password'];                               //SMTP password
        $mail_o->Port     = $mailSettings_a['port'];                                    //TCP port to connect to; use 587 if you have set `SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS`
        $mail_o->CharSet  = $mailSettings_a['charset'];
        $mail_o->setFrom('noreply@korkort24.com', 'Körkort24');
        $mail_o->isHTML(true);    


        //Server settings
        //$mail_o->SMTPDebug = SMTP::DEBUG_SERVER;                      //Enable verbose debug output
        
        
        
        // $mail_o->isSMTP();                                            //Send using SMTP
        // $mail_o->Host     = $mailSettings_a['host'];                     //Set the SMTP server to send through
        // $mail_o->SMTPAuth = true;                                   //Enable SMTP authentication
        // $mail_o->Username = $mailSettings_a['username'];                     //SMTP username
        // $mail_o->Password = $mailSettings_a['password'];                               //SMTP password
        // $mail_o->Port     = $mailSettings_a['port'];                                    //TCP port to connect to; use 587 if you have set `SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS`
        // $mail_o->CharSet  = $mailSettings_a['charset'];
        // $mail_o->setFrom('noreply@korkort24.com', 'Körkort24');
        // $mail_o->addAddress($email_s);     //Add a recipient
        // $mail_o->isHTML(true);                                  //Set email format to HTML


        
        //$mail_o->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;            //Enable implicit TLS encryption
        
        //Recipients
        //$mail_o->setFrom('mail@mikael-nilsson.se', 'Körkort24');
        
        //$mail_o->addAddress('mail@mikael-nilsson.se');
        //$mail_o->addCC('mail@mikael-nilsson.se');
        //$mail_o->addBCC('bcc@example.com');
    
        //Attachments
        //$mail_o->addAttachment('/var/tmp/file.tar.gz');         //Add attachments
        //$mail_o->addAttachment('/tmp/image.jpg', 'new.jpg');    //Optional name
    
        //Content
        
        
        $mail_o->Subject = 'Händelse på korkort24.com';

        
        
        //$mail_o->AltBody = 'Meddelande: ' . $_POST['message'];


        // Iterera dessa tre rader med t ex två olika e-postadresser:


        foreach($mails_a as $mail_a) {
            $mail_o->clearAddresses();
            $mail_o->addAddress($mail_a['address']);
            $mail_o->Body = $mail_a['message'];
            $mail_o->send();
        }
        

    } catch (Exception $e) {
        $response_aa = [
            'status' => 'ok',
            'error' => $mail_o->ErrorInfo
        ];
        echo json_encode($response_aa, JSON_UNESCAPED_UNICODE);
        //echo "Message could not be sent. Mailer Error: {$mail_o->ErrorInfo}";
    }
}







// header('Access-Control-Allow-Origin: *');
// header('Access-Control-Allow-Methods: POST');
// header('Access-Control-Allow-Headers: Content-Type');
// header('Content-Type: application/json; charset=utf-8');

// ini_set('display_errors', 1);
// ini_set('display_startup_errors', 1);
// error_reporting(E_ALL);

// $headers_s = 'Content-Type: text/html; charset=utf-8' . "\r\n"
//            . 'From: Web site <info@kallhallsatletklubb.se>';
// $sendStatus_b = mail('mikaelnilsson1973@hotmail.com', 'Meddelande från formuläret på kallhallsatletklubb.se',  $_POST['message'], $headers_s);
// $response_aa = [
//     'status' => 'ok',
//     'sendStatus' => ($sendStatus_b ? 'ok' : 'error')
// ];
// echo json_encode($response_aa, JSON_UNESCAPED_UNICODE);