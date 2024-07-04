<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST['email'];
    $type = $_POST['type'];
    $department = $_POST['department'];
    $to = 'example@example.com'; 
    $subject = 'New Form Submission';
    $message = "From: $email\nType: $type\nDepartment: $department";
    $headers = 'From: example@example.com' . "\r\n" .
               'Reply-To: example@example.com' . "\r\n" .
               'X-Mailer: PHP/' . phpversion();

    mail($to, $subject, $message, $headers);
    // Redirect to index.html
    header("Location: index.html");
    exit;
}
?>