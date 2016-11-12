# EverPaste

EverPaste is a SPA PasteBin and Server built on top of Node.js.

## Installation

Node >= v6
Postgres

#### Ubuntu 16.04 (xenial)

```bash
curl -sL https://deb.nodesource.com/setup_6.x -o nodesource_setup.sh
sudo bash nodesource_setup.sh
sudo apt-get install nodejs
sudo apt-get install build-essential
sudo apt-get install postgresql postgresql-contrib
```

`everpaste.service`

```
[Unit]
Description=Everpaste

[Service]
ExecStart=/var/www/everpaste/node_modules/.bin/babel-node /var/www/everpaste/server.js
Restart=always
User=nobody
Group=nobody
Environment=PATH=/usr/bin:/usr/local/bin
Environment=NODE_ENV=production
WorkingDirectory=/var/www/myapp

[Install]
WantedBy=multi-user.target
```

Check out the `config.example.json` for more information.

## TODO's

#### Version 1 Milestones

- [ ] Update README.md / Docs
- [x] Update styles for better readability in ReadView
- [ ] Add public panel to main screen
- [ ] Update api for better `curl` post requests/responses
- [x] Add from name input in options box
- [x] Enable expiration functionality
- [ ] Update not found routing
- [ ] Add settings section to change theme and save to cookie
- [ ] More comments in code
- [ ] Enable travis
- [x] Edit functionality
