<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST['name'];
    $email = $_POST['email'];
    $message = $_POST['message'];
    
    $to = ""; // ここに送信先のメールアドレスを指定
    $subject = "新しいお問い合わせ";
    
    $body = "名前: $name\n";
    $body .= "メールアドレス: $email\n\n";
    $body .= "メッセージ:\n$message";
    
    $headers = "From: $email";
    
    if (mail($to, $subject, $body, $headers)) {
        echo "メッセージが送信されました。";
    } else {
        echo "メッセージの送信に失敗しました。";
    }
}
?>