<?php
    $dir = $_GET["folder"];
    $ext = json_decode($_GET["extensions"])->extensions;

    $acceptedFiles = [];
    $files = scandir(__DIR__ . "/../" . $dir);

    foreach($files as $file)
    {
        $fileExtension = pathinfo($file, PATHINFO_EXTENSION);

        if(in_array($fileExtension, $ext)) {
            $acceptedFiles[str_replace("." . $fileExtension, "", $file)] = $dir . "/" . $file;
        }
    }

    echo json_encode($acceptedFiles);
