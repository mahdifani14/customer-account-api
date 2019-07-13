# Customer Account API

This API Handles customers accounts creation and manipulates their information and activities.

## Folder Structure
In order to organize the code, I have created separated directories for the backend and the frontend codes.<br>
However, you would be able to run the application from the directory root as described below.<br><br>
<i><b>Note</b>: Frontend is not ready yet.</i>
## Steps

### 1. Clone Repository
First, you need to clone the GitHub repository on our local machine and go to the application directory, afterwards.<br>
Please run the following commands in your terminal:
```bash
$ git clone https://github.com/mahdifani14/customer-account-api.git
$ cd customer-account-api
```

### 2. Run App Backend
To run the backend, in the directory root run the following commands:
```bash
$ npm i
$ npm run start:backend
```
To access the server <i>Swagger</i> web interface, go to <http://localhost:8080> in your browser.<br>
You can use the provided authentication token and customer info below to practice with the endpoints:

`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjE0IiwibmFtZSI6Ik1haGRpIiwidXNlcl90eXBlIjoidXNlciJ9.4__s_wv81LyO-Qq61ExHXUZIu8-OOlW0l6AObtMnsEs`

Initially, only one customer exists in our DB which you can see below his info:
```json
 {
    "id": "5a34f3d4-3476-4e24-90d7-faf632b58e85",
    "name": "mahdi",
    "surname": "fanidisfani"
 }
```

In our database, we have three collections, `customers`, `accounts`, and `transactions` in which we store customers, accounts and transactions information, respectively. To access the initial entities, you could go to `backend/db/` directory and check JSON files. Feel free to add more users for test purposes but remember to follow the existing data structure.<br>

#### Run MongoDB and Backend Separately
The `npm run start:backend` command is doing couple of things in parallel. First, it installs MongoDB Node module for DB management and run MongoDB locally then it goes to backend directory and after installing dependencies, it runs the backend server.<br>
As you may notice, we are running both DB and server in a single terminal tab, the server and DB logs are getting mixed. If you prefer to have a more clear monitoring on both, you can open two separated terminal tabs then go to the application directory again in both terminals. After that, run the specified terminal commands below in the root of application directory, respectively:<br>
##### Terminal One
```bash
$ npm i
$ npm run mongodb
```
##### Terminal Two
```bash
$ npm run runBackend
```
Now, you can see DB and server are running in different terminals and you could clearly monitor their logs.