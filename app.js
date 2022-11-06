const http = require('http'),
    path = require('path'),
    express = require('express'),
    bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();
app.use(express.static('.'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const db = new sqlite3.Database(':memory:');
db.serialize(function () {
    db.run("CREATE TABLE user (username TEXT, password TEXT, title TEXT)");
    db.run("INSERT INTO user VALUES ('privilegedUser', 'privilegedUser1', 'Administrator')");
});

app.get("/", (req, res) => {
    res.sendFile('index.html');
});

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const query = "SELECT title FROM user WHERE username = '" + username + "' and password = '" + password + "'";

    console.log({ username, password, query })

    db.get(query, function (err, row) {
        if (err) {
            console.log('ERROR', err);
            res.redirect("/index.html#error");
        } else if (!row) {
            res.redirect("/index.html#unauthorized");
        } else {
            res.send(`Hello <b> ${ username } </b>`)
        }
    });
    
})

app.listen(3000);