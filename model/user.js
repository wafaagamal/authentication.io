var mongoose= require('mongoose')
var bcrypt   = require('bcryptjs');


var User= new mongoose.Schema({

name :                 {type :String},
email :                {type :String},
password :             {type :String},
mobilenumber :         {type :String},
emailVerified        : { type: Boolean, default: false},
emailVerifiedAt      : { type: Date},
active               : { type: Boolean, default: false},
createdAt            : { type: Date, default: Date.now },
ticket               : { type :String}

},{ usePushEach: true })

User.methods.createUser =function(user){
  this.name=user.name
  this.email=user.email
  this.mobilenumber=user.mobilenumber
  this.password=this.generateHash(user.password)
}
User.methods.generateHash=function(password){
   return bcrypt.hashSync(password,bcrypt.genSaltSync(10),null)
}
User.methods.comparePass=function(password){
    if(!this.password) return false;
    return bcrypt.compareSync(password,this.password)
}
User.methods.emailVerification=function(){
  this.emailVerified=true
  this.active=true
  this.emailVerifiedAt=Date.now()
}
User.methods.updatePass=function(newPassword){
 this.password=this.generateHash(newPassword)
}
User.pre('save', function(next) {
	next();
});

module.exports = mongoose.model('User', User);