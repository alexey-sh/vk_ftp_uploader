1. cd server
2. npm install
3. setup ftp creds in config.json file
4. node ./
5. install extension
6. ???
7. PROFIT


Example of server/config.json
{
  "ftpCreds": {
    "host": "myftphost",
    "port": 21,
    "user": "name",
    "pass": "123456"
  },
  "server": {
    "port": 9000
  }
}

*Note: server.port hardcoded in chrome extension at the moment