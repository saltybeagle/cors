<?php

// Specify domains from which requests are allowed
header('Access-Control-Allow-Origin: *');

// Specify which request methods are allowed
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');

// Additional headers which may be sent along with the CORS request
// The X-Requested-With header allows jQuery requests to go through
header('Access-Control-Allow-Headers: X-Requested-With');

// Exit early so the page isn't fully loaded for options requests
if (strtolower($_SERVER['REQUEST_METHOD']) == 'options') {
    exit();
}

echo 'Hello CORS, this is '
     . $_SERVER['SERVER_NAME'] . PHP_EOL
     .'You sent a '.$_SERVER['REQUEST_METHOD'] . ' request.' . PHP_EOL;

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    echo 'Your name is ' . htmlentities($_POST['name']);
}