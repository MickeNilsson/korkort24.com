<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_FILES['file']) && $_FILES['file']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = './';
        if (!file_exists($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        $filename = basename($_FILES['file']['name']);
        $targetFile = $uploadDir . $filename;

        if (move_uploaded_file($_FILES['file']['tmp_name'], $targetFile)) {
            echo "Filen har laddats upp som $filename.";
        } else {
            http_response_code(500);
            echo "Misslyckades att spara filen.";
        }
    } else {
        http_response_code(400);
        echo "Ingen giltig fil mottagen.";
    }
} else {
    http_response_code(405);
    echo "Endast POST tillåts.";
}