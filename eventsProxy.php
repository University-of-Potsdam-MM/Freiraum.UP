<?php

header('Content-Type: application/xml');
echo file_get_contents('https://www.uni-potsdam.de/veranstaltungen/rss-feed-abonnieren/eventfeed/feed/xml.html?tx_upevents_upeventfeed%5Blimit%5D=30&tx_upevents_upeventfeed%5Bcat%5D=&tx_upevents_upeventfeed%5BcatLink%5D=or');
