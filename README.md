# Trivia Play

## Starting the Applications

Run local MongoDB instance (if installed with homebrew): 
```
brew services start mongodb-community@8.2
mongosh
```

Start server with seed data:
```
cd server
npm install
npm run seed
npm start
```

Start admin dashboard in dev mode:
```
cd admin-dashboard
npm run dev
```
