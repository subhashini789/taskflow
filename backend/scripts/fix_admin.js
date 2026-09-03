const mongoose = require('mongoose');
require('dotenv').config({path: '../.env'});

mongoose.connect('mongodb://127.0.0.1:27017/trello-clone').then(() => {
  mongoose.connection.db.collection('users').updateOne(
    {email: 'admin@example.com'}, 
    { $set: {role: 'user'} }
  ).then(() => { 
    console.log('Reverted to user'); 
    process.exit(0); 
  });
});
