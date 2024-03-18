<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';

include "config.php";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST['email'];

    if (isset($email)) {
        $code = "";
        for ($i = 0; $i < 5; $i++) {
            $number = rand(0, 10);
            $code .= $number;
        }

        $query1 = "SELECT `id`, `email`, `password`, `code`, `phonenumber`, `address`, `registration` FROM `student` WHERE email = '{$email}'";
        $result = mysqli_query($conn, $query1);

        $sender = "omondiakinyi5@gmail.com";
        $password = 'zbayjrbbncywsdbx';
        $to = $email;

        $mail = new PHPMailer(true);
        $mail->addAddress($to);

        if (mysqli_num_rows($result) > 0) {
            $resultarr = mysqli_fetch_array($result);
            $id = $resultarr["id"];

            $query2 = "UPDATE `student` SET `code`='$code' WHERE id = '$id'";
            mysqli_query($conn, $query2);

            $subject = "Password retrieval code";
            $message = "Your retrieval code is " . $code;
            $headers = "From: $subject\r\n";


            try {
                $mail->SMTPDebug = SMTP::DEBUG_SERVER;
                $mail->isSMTP();
                $mail->Host = 'smtp.gmail.com';
                $mail->SMTPAuth = true;
                $mail->Password = $password;
                $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
                $mail->Port = 587;

                $mail->setFrom($sender);

                $query3 = "INSERT INTO `student` (`email`, `code`) VALUES ('$email', '$code')";
                $mail->isHTML(true);
                $mail->Subject = $subject;
                $mail->Body = $message;

                $mail->send();
                echo 'Message has been sent';
            } catch (Exception $e) {
                echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
            }
        } else {
            mysqli_query($conn, $query3);

            // Send email using Gmail's SMTP server
            $subject = "Password retrieval code";
            $message = "Your retrieval code is " . $code;

            $headers = "From: $sender"; // Replace with your Gmail address

            try {
                $mail->SMTPDebug = SMTP::DEBUG_SERVER;
                $mail->isSMTP();
                $mail->Host = 'smtp.gmail.com';
                $mail->SMTPAuth = true;
                $mail->Password = $password;
                $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
                $mail->Port = 587;

                $mail->setFrom($sender);

                $mail->isHTML(true);
                $mail->Subject = $subject;
                $mail->Body = $message;

                $mail->send();
                echo 'Message has been sent';
            } catch (Exception $e) {
                echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
            }
        }
    }
}
?>