const mongoose = require('mongoose');
const crypto = require('crypto');
const uuidv1 = require('uuid/v1');
mongoose.Promise = global.Promise;

let userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 32
    },
    lastname: {
        type: String,
        maxlength: 32,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    userinfo: {
        type: String,
        trim: true
    },
    hassed_password: {
        type: String,
        required: true
    },
    salt: String,
    // role: 0 user, role: 1 admin
    role: {
        type: Number,
        default: 0
    },
    purchases: {
        type: Array,
        default: []
    }
}, {timestamps: true});


userSchema.methods = {
    authenticate: function(password) {
        return this.hassed_password === this.hassedPassword(password, this.salt);
    },
    hassedPassword: function(plainpassword) {
        if (!plainpassword) return '';
        try {
            return crypto.createHmac('sha256', this.salt)
            .update(plainpassword)
            .digest('hex');
        } catch (err) {
            return '';
        }
    }
};

userSchema.virtual('password')
    .set(function (password) {
        this._password = password;
        this.salt = uuidv1();
        this.hassed_password = this.hassedPassword(password);
    })
    .get(function () {
        return this._password;
    })

module.exports = mongoose.model("User", userSchema);
