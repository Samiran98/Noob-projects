const mongoose = require('mongoose')
const Joi = require('joi');
const slugify = require('slugify')
const marked = require('marked')
const createDomPurify = require('dompurify')
const { JSDOM } = require('jsdom')

const dompurify =  createDomPurify(new JSDOM().window)

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required : true
    },
    email:{
        type : String,
        required : true,
        unique: true
    },
    username:{
        type : String,
        required : true,
        unique: true
    },
    createdAt: {
        type: Date,
        default : Date.now()
    },
    password: {
        type: String,
        required: true
    }
})

function validateUser(userSchema) {
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        username: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    };
    return Joi.validate(userSchema, schema);
}
// articleSchema.pre('validate', function (next){
//     if(this.title){
//         this.slug = slugify(this.title, { lower: true, strict: true })
//     }

//     if(this.markdown){
//         this.sanitizedHtml = dompurify.sanitize(marked.parse(this.markdown))
//     }

//     next()
// })


module.exports = mongoose.model('User',userSchema)
exports.validate = validateUser;