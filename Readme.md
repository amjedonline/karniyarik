# Karniyarik
*REST API server for managing arbitrary business objects in a microservice system architecture.*

## Getting started

1. Install __node__ on your system, [here](https://nodejs.org/en/download/package-manager/) is the detailed instructions on setting up the Node server.
2. Install mongodb from [here](https://docs.mongodb.org/manual/installation/)
3. Start mongodb daemon in a shell window using the below command
```
mongo-installation/bin$ ./mongod --dbpath path-to-mongodata/data_dir
```
4. Start the node server with from the main project directory
```
$ node server.js
```
5. To run the test cases, simply execute the below command from the main project directory
```
$ mocha
```

The server should be now ready to be accessed at http://localhost:3000
