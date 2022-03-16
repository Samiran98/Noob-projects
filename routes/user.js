const express = require('express')
const User = require('./../models/user')

const router = express.Router()

router.post('/register', (req,res) => {
    console.log(req.body)
    res.json({status : 'ok-by'})
})

module.exports = router