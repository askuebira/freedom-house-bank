const express = require('express');
const mongoose = require('mongoose');
const faker = require('faker');
const { randomInt } = require('crypto');

const app = express();
app.use(express.json());
app.use(express.static('frontend'));

mongoose.connect('mongodb://localhost:27017/freedomHouseBank', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// User Schema
const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    fullName: String,
    balance: { type: Number, default: 0 },
    withdrawals: [{ amount: Number, status: String, createdAt: Date }],
    tradingHistory: [{ amount: Number, status: String, tradeTime: Date }],
});

const User = mongoose.model('User', userSchema);

// Generate 50 random users
const generateRandomUsers = async () => {
    const tlds = ['com', 'net', 'org', 'io', 'us', 'biz'];

    for (let i = 0; i < 50; i++) {
        const username = faker.internet.userName();
        const email = `${username}@${faker.internet.domainName()}`;
        const balance = randomInt(1000, 10000);

        const tradingHistory = Array.from({ length: 10 }, () => ({
            amount: randomInt(100, 1000),
            status: faker.random.arrayElement(['completed', 'pending']),
            tradeTime: faker.date.recent(),
        }));

        const withdrawals = Array.from({ length: 5 }, () => ({
            amount: randomInt(100, 500),
            status: faker.random.arrayElement(['pending', 'successful']),
            createdAt: faker.date.recent(),
        }));

        await User.create({
            username,
            email,
            fullName: faker.name.findName(),
            balance,
            tradingHistory,
            withdrawals,
        });
    }
};

// Endpoint to generate random users
app.post('/generate-users', async (req, res) => {
    await generateRandomUsers();
    res.status(201).send('Users generated successfully');
});

// Get users sorted by balance
app.get('/users', async (req, res) => {
    const users = await User.find().sort({ balance: -1 });
    res.json(users);
});

// Get trading updates
app.get('/trade-updates', async (req, res) => {
    const users = await User.find();

    const trades = users.flatMap(user => user.tradingHistory.map(trade => ({
        username: user.username,
        amount: trade.amount,
        status: trade.status,
        tradeTime: trade.tradeTime,
    })));

    res.json(trades);
});

// Get withdrawal updates
app.get('/withdrawal-updates', async (req, res) => {
    const users = await User.find();

    const withdrawals = users.flatMap(user => user.withdrawals.map(withdrawal => ({
        username: user.username,
        amount: withdrawal.amount,
        status: withdrawal.status,
        createdAt: withdrawal.createdAt,
    })));

    res.json(withdrawals);
});

// Start the server
app.listen(5000, () => console.log('Server running on port 5000'));
