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
The server should be now ready to be accessed at http://localhost:3000/api

## Running integration test
The test cases cover the contract of the rest interfaces.
Chai, chai-assert, chai-datetime and chai-http is used  primarily along with mocha as testing framework.

To run the test cases, simply execute the below command from the main project directory
```
$ mocha
```

## Trying ready to use HTTP requests.
The file _postman-collection.js_ contains the latest collection of HTTP Requests that can be replayed with _Postman_.
Install Postman for Mac OS or a Google chrome plugin from [here](https://www.getpostman.com)


## Available Business Objects
1. User
2. Driver

_For more information on provided Rest APIs please check the postman collection and chai test cases under /test directory._
