const express = require('express');
const path = require('path');
const redis = require('./lib/redis');
const usersHandler = require('./handlers/users');


const app = express();

app.set('view engine', 'ejs')
app.use('/static', express.static(path.join(__dirname, 'public')));


//GET
app.get('/', (req, res) => {
    res.render(path.join(__dirname, 'views', 'index.ejs'));
});

app.get('/user/:id', (req, res) => {
    res.status(200).send(req.params.id)
})

//error handling


app.get('/user/:id', async (req, res) => {
    try {
        const user = await usersHandler.getUser(req);
        res.status(200).json(user);
    } catch (err) {
        console.error(err)
        res.status(500).send('internal error')
    }
});


app.get('/users', async (req, res) => {
    try {
        const locals = await usersHandler.getUsers(req);
        res.render(path.join(__dirname, 'views', 'users.ejs'), locals)
  
    } catch (err) {
        console.error(err);
    }
});



redis.connect()
.once('ready', async () => {
    try {
        await redis.init();
        
        app.listen(3000, () => {
            console.log('start listening');
    });
} catch (err) {
    console.error(err);
    process.exit(1);
}
})
.on('error', (err) => {
    console.error(err);
    process.exit(1);
});

