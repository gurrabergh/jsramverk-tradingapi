const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require('morgan');
const cors = require('cors');
var bcrypt = require('bcryptjs');
const port = 1338;

const mongo = require("mongodb").MongoClient;
const dsn = "mongodb://localhost:27017/users";

require('dotenv').config();
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

if (process.env.NODE_ENV !== 'test') {
    // use morgan to log at command line
    app.use(morgan('combined')); // 'combined' outputs the Apache style LOGs
}


app.post("/register", (req, res) => {
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(req.body.psw, salt, function(err, hash) {
            mongo.connect(dsn, {useUnifiedTopology: true}, function(err, db) {
                if (err) {
                    return res.status(403).json({
                        data: {
                            msg: 'failed'
                        }
                    });
                }
                var dbo = db.db("users");

                if (process.env.NODE_ENV === 'test') {
                    dbo = db.db("test");
                }
                var user = { _id: req.body.usr, psw: hash, portfolio: [], balance: 0 };

                dbo.collection("users").insertOne(user, function(err) {
                    if (err) {
                        return res.status(403).json({
                            data: {
                                msg: 'failed'
                            }
                        });
                    }
                    db.close();
                    return res.status(201).json({
                        data: {
                            msg: 'success'
                        }
                    });
                });
            });
        });
    });
});

app.post("/login", (req, res) => {
    checkLogin(req, res);
});

async function checkLogin(req, res) {
    console.log(req.body.usr)
    try {
        let dbRes = await getAcc(dsn, "users", {_id: req.body.usr}, {}, 0);

        bcrypt.compare(req.body.psw, dbRes[0].psw, function(err, result) {
            console.log(result)
            if (result === true) {
                const jwt = require('jsonwebtoken');
                const payload = { email: req.body.usr };
                const secret = process.env.JWT_SECRET;
                const token = jwt.sign(payload, secret, { expiresIn: '1h'});

                return res.status(201).json({
                    data: {
                        token: token
                    }
                });
            }
            return res.status(403).json({
                data: {
                    msg: 'login failed'
                }
            });
        });
    } catch (err) {
        return res.status(403).json({
            data: {
                msg: 'login failed'
            }
        });
    }
}

app.post("/acc",
    (req, res, next) => checkToken(req, res, next),
    (req, res) => getAccData(res, req.body));

app.post("/balance",
    (req, res, next) => checkToken(req, res, next),
    (req, res) => updateBalance(res, req.body));

app.post("/purchase",
    (req, res, next) => checkToken(req, res, next),
    (req, res) => purchaseStock(res, req.body));

function checkToken(req, res, next) {
    const jwt = require('jsonwebtoken');
    const token = req.headers['x-access-token'];

    jwt.verify(token, process.env.JWT_SECRET, function(err) {
        if (err) {
            return res.status(403).json({
                data: {
                    msg: 'not authorized jwt',
                    jwt: err
                }
            });
        }
        next();
        return undefined;
    });
}

async function updateBalance(res, body) {
    mongo.connect(dsn, {useUnifiedTopology: true}, function(err, db) {
        if (err) {
            throw err;
        }
        var dbo = db.db("users");
        var user = { _id: body.id };

        var newValue = { $inc: {balance: parseInt(body.balance) } };

        dbo.collection("users").updateOne(user, newValue, function(err) {
            if (err) {
                return res.status(403).json({
                    msg: 'fail'
                });
            }
            db.close();
            return res.status(201).json({
                msg: 'success'
            });
        });
    });
}

async function purchaseStock(res, body) {
    mongo.connect(dsn, {useUnifiedTopology: true}, function(err, db) {
        if (err) {
            throw err;
        }
        var dbo = db.db("users");
        var user = { _id: body.id };

        var newValue = { $set: {portfolio: body.portfolio, balance: body.balance } };

        dbo.collection("users").updateOne(user, newValue, function(err) {
            if (err) {
                return res.status(403).json({
                    msg: 'failed'
                });
            }
            db.close();
            return res.status(201).json({
                msg: 'success'
            });
        });
    });
}

async function getAccData(res, body) {
    const client  = await mongo.connect(dsn, {useUnifiedTopology: true});
    const db = await client.db();
    const col = await db.collection('users');
    const result = await col.find( { _id: body.usr }, {} ).limit(0).toArray();

    await client.close();

    return res.status(201).json({
        data: result
    });
}

async function getAcc(dsn, collection, criteria, projection, limit) {
    const client  = await mongo.connect(dsn, {useUnifiedTopology: true},);
    const db = await client.db();
    const col = await db.collection(collection);
    const res = await col.find(criteria, projection).limit(limit).toArray();
    console.log(res)

    await client.close();
    return res;
}

function getStockPrice(input) {
    var stock = function randomAroundZero() {
        return Math.random() > 0.5 ? 1 : -1;
    };
    let start = input.price;
    let rate = input.rate;
    let variance = input.variance;

    return start * rate + variance * stock();
}
var stocks = [
    {name: 'Volvo', price: 100, rate: 1.001, variance: 2.6},
    {name: 'Astra Zeneca', price: 500, rate: 1.001, variance: 3},
    {name: 'Swedbank', price: 140, rate: 1.001, variance: 1.3}
];

setInterval(function () {
    stocks.map((stock) => {
        stock["price"] = Math.round((getStockPrice(stock) + Number.EPSILON) * 100) / 100;
        return stock;
    });

    io.emit("stocks", stocks);
}, 5000);


// Start up server
const server = app.listen(port);
const io = require('socket.io')(server);

io.origins(['https://trading.gustavbergh.me:443']);

io.on('connection', function (socket) {
    socket.on('chat message', function (message) {
        io.emit('chat message', message);
    });
});

module.exports = server;
