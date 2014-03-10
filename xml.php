<?php

require __DIR__ . '/vendor/autoload.php';

ini_set('error_log', dirname(__FILE__) . '/php_error.log');

use Guzzle\Http\Client;
use Guzzle\Plugin\Oauth\OauthPlugin;

$campus = $_GET['campus'];
$start_time = $_GET['startTime'];
$end_time = $_GET['endTime'];
$method = $_GET['method'];

$i = 0;

$cache = new \Doctrine\Common\Cache\FilesystemCache(__DIR__ . '/cache');
$id = md5(json_encode(array('method' => $method, 'campus' => $campus, 'startTime' => $start_time, 'endTime' => $end_time)));

while ($i < 10)
{
    try
    {

        $client = new Client('http://usb.soft.cs.uni-potsdam.de/roomsAPI/1.0/');

 #      $client = new Client('http://fossa.soft.cs.uni-potsdam.de:8280/services/roomsAPI/');


        $request = $client->get($method, array(
            'Authorization' => 'Bearer af964849b787c7b3a37b234b83fc9bb'
        ));
        $request->setHeader('Expect', null);
        $request->setHeader('Accept', null);
        $request->getQuery()->set('campus', $campus)->set('endTime', $end_time)->set('startTime', $start_time);

        $response = $request->send();

        $body = trim($response->getBody());
    }
    catch (Exception $exception)
    {
        error_log(var_export($exception, true));
        break;
    }

    if (!empty($body))
    {
        if(!headers_sent())
        {
            header('Content-Type: text/xml');
        }

        error_log('serving body with size' . strlen($body));
        echo $body;
        $cache->save($id, $body);
        die();
    }

    $i++;
    sleep(0.1);
}

if(!headers_sent())
{
    header('Content-Type: text/xml');
}

error_log("<error>Server does not reply with a non-empty response, after $i retries!</error>");

if ($cache->contains($id))
{
    $body = $cache->fetch($id);
    error_log('serving cached body with size' . strlen($body));
    echo $body;
    die();
}

echo "<error>Server does not reply with a non-empty response, after $i retries!</error>";
