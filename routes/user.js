const express = require('express')
const User = require('./../models/user')
const bcrypt = require('bcrypt')
const saltRounds = 12
const jwt = require('jsonwebtoken')

const JWT_SECRET = '811d97e9b8625b756320be4ee958485828ec74ca5e2f7577a13c6798460aa672731d6f141e429551e3929e923a35f482d4ec1ccd07f7208cc88ae6edb9a5e54f'


const router = express.Router()

router.post('/register', async (req, res) => {
    const { name, username, email, password: plainTextPassword } = req.body

    if (!username || typeof username != 'string') {
        return res.json({ error: 'username must be a string' })
    }

    if (!plainTextPassword || typeof plainTextPassword != 'string') {
        return res.json({ error: 'Invalid password' })
    }

    if (plainTextPassword.length < 5) {
        return res.json({ error: 'Password too small' })
    }

    const password = await bcrypt.hash(plainTextPassword, saltRounds)

    try {
        const response = await User.create({ name, username, email, password })
        console.log(response)
    } catch (error) {
        console.log(error.message)
        if (error.code === 11000) {
            return res.json({ status: 'Error', error: 'Username already in use' })
        }
        throw error
    }
    res.json({ status: 'ok' })
})

router.post('/login', async (req, res) => {
    const { username, password } = req.body

    const user = await User.findOne({ username }).lean()

    console.log(user)

    if (!user) {
        return res.status(401).json({ status: 'error', error: 'Invalid username/password' })
    }

    if (await bcrypt.compare(password, user.password)) {
        // the username ,password combination is succerssful

        const token = jwt.sign({
            id: user._id,
            username: user.username
        }, JWT_SECRET)

        return res.status(201).json({ status: 'ok', data: user, token: token, message: 'Login Successful' })
    } else {
        return res.status(403).json({ status: 'error', message: 'Invalid password' })
    }
})

module.exports = router