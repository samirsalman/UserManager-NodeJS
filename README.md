# User Manager NodeJS

## Short Description
A User Manager Project, written in NodeJS to create/read/delete/update users in a MongoDB database, manage login/register with or without cookie and PRO feature of a user.
 
## Features

- Customizable User schema that using mongoose package to communicate with MongoDB  
- CRUD operations for Users and Cookies
- Login/Logout
- Registration User 
- Get Users feature
- Buy PRO feature
- Cookie Manager for login/logout
- API Rate Limit 
- Logging

## Cookie Manager
In login operation there are two different flow, if there is a cookie in request's header then **Cookie Manager** verify if the cookie is expired, if yes continue with standard login flow and set the cookie with 1 day expires, otherwise do login with the cookie.
Moreover **Cookie Manager** delete expired cookies with a daily scheduled script.

## Logout flow

Logout function deletes cookie of the User from the database.

## Responses Schema

All responses from the APIs follow this schema:
`{error: true or false, 
  message: message of response, 
  (eventually) data: payload of response}  `

## Project Architecture

The project is structured as follows:
- config (_Eventually to use init scripts_)
  - index.js
  - server.js
- models (_Contains the objects schema_)
  - Cookie.js
  - User.js
- services (_Contains the buisness logic of the app_)
  - CookieService.js
  - UserService.js
- app.js (_Is the entry point of the app_)


## APIs calls

- **POST** `/users/createUser` [parameters: name, lastName, years, city, email, password]
- **POST** `/users/login` [parameters: email,password] if you haven't cookie
- **POST** `/users/login` [parameters: //] if you have cookie
- **GET** `/users/getUsers` [parameters: //]
- **DELETE** `/users/deleteUser` [parameters: email, password]
- **PATCH** `/users/updateUser` [parameters: parameters that you want change]
- **PATCH** `/users/updateUser/email` [parameters: email, newEmail]
- **PATCH** `/users/updateUser/password` [parameters: email, password,newPassword]
- **POST** `/users/buyPro` [parameters: email]
- **POST** `/users/logout` [parameters: email]



## How to Start?

If you have local MongoDB server you can just launch commands:
`npm install`

or eventually in Linux

`sudo npm install`

to install all packages and then:

`node app.js`

to start the application.

If you haven't a local MongoDB server, you can add your remote MongoDB server.
To do that you must edit the **data.env** file and set the correct values.

`DB_HOST= <MongoDB Server REMOTE ADDRESS>`
`DB_PORT=<MongoDB Server PORT>`

## Author

**Samir Salman**
