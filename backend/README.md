
# Groupomania-backend

Creation of a corporate social network using : 
   - Vue 2, VueCLI, vuetify, vuex, vuerouter for the first front
   - Vue 3, Vite, quasar, pinia, vuerouter for the second front
   - **Express, sequelize js for the back.**

## Run Locally

Go to the backend project directory

```bash
  cd RossiLoic_7_19012022/backend
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
  or 
  nodemon server
```

## Server configuration

To run this project, you will need to add the following config to your config.json file

```js
{
  "development": {
    "username": "",
    "password": "",
    "database": "",
    "host": "",
    "dialect": "mysql"
  },
  "test": {
    "username": "",
    "password": "",
    "database": "",
    "host": "",
    "dialect": "mysql"
  },
  "production": {
    "username": "",
    "password": "",
    "database": "",
    "host": "",
    "dialect": "mysql"
  }
}
```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`SECRET_TOKEN=`

**Only if you want to use reset password option**
`HOST=`
`EMAIL=`
`PASSWORD=`
`SERVICE=`
`URL=`


**Only if you want to use Google connexion, you also need :**

`GOOGLE_CLIENT_ID=`
`GOOGLE_CLIENT_SECRET=`
`GOOGLE_REDIRECT_URL=`

And you will need a Database using `mysql` (for sequelize)



## Authors

- [@Mars375](https://github.com/Mars375)

