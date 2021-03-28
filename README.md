### Introduction
This is the famous tiny url project where users can get shortUrls for longUrls.

### Structure
1. Appserver : POC for users for everything - registering long url and redirecting to long url
2. KeyDb : Offline Service which generates shortUrlIds that AppServer can reuse

Everything is in nodeJs (JS is everywhere :P)

### Steps to run:
#### Start the database(mongo db)
1. brew services start mongodb-community@4.4
2. Make a new table named tinyurl and key-db using mongo client (e.g. `use tinyurl`)

#### Start App server
1. cd AppServer
2. npm install
3. npm run dev
Will start the server on port 3000

#### Start KeyDb service
1. cd KeyDb
2. npm install
3. npm run dev
Will start the server on port 3001

## Endpoints info
1. http://localhost:3000/api/:longUrl => Returns registered shortUrl
2. http://localhost:3000/api/ with body(json) `{"longUrl": "https://github.com/shah-anurag/tiny-url"}` => For registering a longUrl
3. http://localhost:3001/shortUrlId => Only supports GET requests to get a short URL
