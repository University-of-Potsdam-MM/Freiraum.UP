<?php

require __DIR__ . '/vendor/autoload.php';

$cache = new \Doctrine\Common\Cache\FilesystemCache(__DIR__ . '/cache');

$campus = $_GET['campus'];
$start_time = $_GET['startTime'];
$end_time = $_GET['endTime'];
$method = $_GET['method'];

$id = json_encode(array('method' => $method, 'campus' => $campus, 'startTime' => $start_time, 'endTime' => $end_time));

if ($cache->contains($id))
{
    $response = $cache->fetch($id);
}
else
{
    $client = new SoapClient("http://elis.soft.cs.uni-potsdam.de:7000/timeeditWS/ws?wsdl", array(
        "trace" => 1, "exception" => 0
    ));

    $client->$method(array('request' => array(
        'campus' => $campus,
        'endTime' => $end_time,
        'startTime' => $start_time
    )));

    $response = $client->__getLastResponse();

    $cache->save($id, $response);
}

header('Content-Type: application/xml');

echo $response;
