optimize-helper
===============

A bookmarklet with a bit of PHP to help with Optimizely setup

Vhosts setup:

<VirtualHost *:80>
    ServerName optimize-helper.local

    ServerAdmin webmaster@dummy-host2.example.com
    DocumentRoot "c:/wamp/www/optimize-helper"

    ErrorLog "logs/optimize-helper-error.log"
    CustomLog "logs/optimize-helper-access.log" common
</VirtualHost>

Hosts file setup:

127.0.0.1 optimize-helper.local

