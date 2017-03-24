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

Set up your database and then copy `server/config/config.example.js` to `server/config/config.js` and alter the fields as necessary.

`npm start` will start a development server.

`npm run prod` will start a production server.

Check out `server/tools` for helpful files and utilities.
