# Tools

This directory contains items that might be helpful for installing EverPaste.

### everpaste.service

Move this file to `/etc/systemd/system`. Make sure the project is located at `/var/www/everpaste` otherwise alter `everpaste.service` where appropriate.

### start.sh

Used by `everpaste.service` to start the production server.
