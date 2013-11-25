#!/bin/bash
cd `dirname $0`
if [ ! -f composer.phar ]
then
	echo "Downloading composer"
	curl -sS https://getcomposer.org/installer | php
fi

if [ "`which bower`" == "" ]
then
	echo "Installing bower, please enter root password:"
	sudo npm install -g bower
fi

php composer.phar install
bower install
