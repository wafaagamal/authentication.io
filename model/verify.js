var mongoose= require('mongoose')
const uuidv4 = require('uuid/v4')

var Verify= new mongoose.Schema({

userID	    		 : { type: mongoose.Schema.Types.ObjectId,ref: 'User'},
email                : { type :String},
code                 : { type :String},
createdAt            : { type: Date, default: Date.now }

},{ usePushEach: true })

Verify.methods.createHash =function(user){
    this.userID=user._id
    this.email=user.email
    return this.code=uuidv4()
}
Verify.pre('save', function(next) {
    this.createdAt=Date.now()
	next();
});

module.exports = mongoose.model('Verify', Verify);