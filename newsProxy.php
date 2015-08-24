<?php

header('Content-Type: application/xml');
echo file_get_contents('http://www.uni-potsdam.de/nachrichten/rss-feed-abonnieren.html?type=100&tx_ttnews%5Bcat%5D=19');
