let mongoose = require('mongoose');
let bcrypt = require('bcryptjs');

let UserSchema = new mongoose.Schema({
    name: String,
    password: String,
    imgPath: String
});

module.exports = mongoose.model('User', UserSchema);

module.exports.addUser = (newUser, callback) => {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) {
                console.log(`Error hashing the password; Error: ${err}`)
            } else {
                newUser.password = hash;
                console.log(newUser.password);
                newUser.save(callback);
            }
        });
    });
};

module.exports.comparePassword = (myTypedPassword, hashPassword, callback) => {
    bcrypt.compare(myTypedPassword, hashPassword, (err, res) =>{
        if(err) {
            console.log(`Error comparing the passwords; Error: ${err}`)
        } else {
            console.log(`Response from comparing passwords: Response: ${res}`);
            callback(null, res);
        }
    })
};