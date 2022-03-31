const express = require('express')
const User = require('./../models/user')
const bcrypt = require('bcrypt')
const saltRounds = 12
const jwt = require('jsonwebtoken')

const JWT_SECRET = 'ashhas%#^TGhfhgui*&Q#^$&guygfyganu98by98eb929^R&@#*b8sgf87tiusdggf7t827tr28gf2gf'


const router = express.Router()

router.post('/register', async (req,res) => {
    const {name, username, email, password: plainTextPassword} = req.body

    if(!username || typeof username != 'string'){
        return res.json({error:'username must be a string'})
    }

    if(!plainTextPassword || typeof plainTextPassword != 'string'){
        return res.json({error:'Invalid password'})
    }

    if(plainTextPassword.length < 5){
        return res.json({error:'Password too small'})
    }

    const password = await bcrypt.hash(plainTextPassword, saltRounds)

    try{
        const response = await User.create({name,username,email,password})
        console.log(response)
    }catch(error){
        console.log(error.message)
        if(error.code === 11000){
            return res.json({status: 'Error',error:'Username already in use'})
        }
        throw error
    }
    res.json({status:'ok'})
})

router.post('/login', async (req,res) => {
    const { username, password } = req.body

    const user = await User.findOne({username}).lean()

    console.log(user)

    if(!user){
        return res.json({status:'error',error:'Invalid username/password'})
    }

    if(await bcrypt.compare(password, user.password)){
        // the username ,password combination is succerssful

        const token = jwt.sign({
            id : user._id,
            username: user.username
        },JWT_SECRET)

        return res.json({status:'ok', data:user,token:token, message:'Login Successful'})
    } else {
        return res.json({status:'error', message:'Invalid password'})
    }
})

module.exports = router