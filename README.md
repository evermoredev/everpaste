# EverPaste

EverPaste is a SPA PasteBin built with React combined with a Server API built on top of Node.js.

See it live at: [EverPaste.io](https://everpaste.io)

## Installation

Node >= v7.9
Postgres >= 9.5

#### Ubuntu 16.04 (xenial)

```bash
# Add the keys and source for Node 7.x
sudo curl -s https://deb.nodesource.com/gpgkey/nodesource.gpg.key | apt-key add -
sudo sh -c "echo deb https://deb.nodesource.com/node_7.x zesty main \
> /etc/apt/sources.list.d/nodesource.list"
# Update and install node
sudo apt update
sudo apt install nodejs
# Install build tools and postgresql
sudo apt-get install build-essential postgresql postgresql-contrib
# Make sure to create a user and set the user password for the database
```

Set up your database and then copy `server/config/config.example.js` to `server/config/config.js`, `client/config/config.example.js` to `client/config/config.js` and alter the fields as necessary.

`npm start` will start a development server.

`npm run prod` will start a production server.

Check out `server/tools` for helpful files and utilities.

#### Working with Migrations

To create your own migration, add a file to the `/server/migrations` folder that exports:

  * `name`: Name of the migration
  * `up`: Query string to be run in the up direction.
  * `down`: Query string to be run in the down direction.
  
** Important ** The name of the migration file matters, as they are loaded in alphabetical order. 

#### Folder Structure

  * `client`: This is where the React app lives as well as modules and configuration that are specific to the client only. Make sure not to put sensitive data like api keys in the config here. 
  * `public`: Location of static files.
  * `shared`: Location of files that can be accessed by both the client and the server. This is a good place for validations, to ensure that the same validations are done on the client and server.
  * `server`: This folder contains the node server and configurations that shouldn't be accessed directly by the client.

#### Securing with SSL

The EverPaste server is ready to handle SSL. Simply uncomment the section in `server/config/config.js` and replace the paths with your SSL paths. Generating SSL certs is incredibly easy with CertBot (formerly LetsEncrypt).

Using `everpaste.io` as an example:
```bash
# Clone certbot
git clone https://github.com/certbot/certbot
# move into the certbot directory and create the certs
./certbot-auto certonly --standalone --email admin@everpaste.io -d everpaste.io
```

Uncomment this area in your `config.js` and update the path like:
```bash
  "sslEnabled": true,
  "sslPort": process.env.SSL_PORT || 443,
  "certPrivateKey": "/etc/letsencrypt/live/everpaste.io/privkey.pem",
  "certChain": "/etc/letsencrypt/live/everpaste.io/fullchain.pem",
  "certCa": "/etc/letsencrypt/live/everpaste.io/chain.pem",
```

#### Posting data with curl

`curl -d "text=$(cat myfile.txt)" http://location.of.pastebin/api`

with some extra params:

`curl -d "text=$(cat myfile.txt)&privacy=private&name=nate&title=my paste" http://location.of.pastebin/api`

You'll receive the url of your paste as a response:

`http://location.of.pastebin/dcDmmasdwe`