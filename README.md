# EverPaste

EverPaste is a SPA PasteBin and Server built on top of Node.js.

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
  
** Important ** The name of the migration matters, as they are loaded in alphabetical order. 

#### Folder Structure

  * `client`: This is where the React app lives as well as modules and configuration that are specific to the client only. Make sure not to put sensitive data like api keys in the config here. 
  * `public`: Location of static files.
  * `shared`: Location of files that can be accessed by both the client and the server. This is a good place for validations, to ensure that the same validations are done on the client and server.
  * `server`: This folder contains the node server and configurations that shouldn't be accessed directly by the client.

#### Posting data with curl

`curl -d "text=$(cat myfile.txt)" http://location.of.pastebin/api`

with some extra params:

`curl -d "text=$(cat myfile.txt)&privacy=private&name=nate&title=my paste" http://location.of.pastebin/api`

You'll receive the key in the response:

`{ "key": "dcDmmasdwe" }`

Your paste will now be available at:

`http://location.of.pastebin/dcDmmasdwe`