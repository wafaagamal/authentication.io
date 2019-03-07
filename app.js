var express =require('express')
var mongoose =require('mongoose')
var cors = require('cors')
var uCheck = require('ucheck');
const bodyParser = require('body-parser');
let User =require('./model/user.js')
let jwt = require('./auth.js/token.js')
var app =express()
const verify = require("./verfication.js");
let Verify=require('./model/verify.js')

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/login',{ useNewUrlParser: true } )

app.use( bodyParser.json() ); 
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors())

app.post('/api/register', function(req, res) {
    var x = [ {
            param: 'email',
            label: 'Email',
            required: true,
            type: 'string',
            length: { min: 10 , max: 30},
            regex: /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,4}$/
        },{
            param: 'password',
            label: 'Password',
            required: true,
            type: 'string',
            length: { min:6, max: 20}
        },
        {
            param: 'name',
            label: 'Name',
            required: true,
            type: 'string',
            length: {min: 3, max: 16},
            regex: /^[a-z0-9_-]{3,16}$/
        },
        {
            param: 'mobilenumber',
            label: 'mobilenumber',
            required: true,
            type: 'string',
            length: {min: 11, max: 11}
        }]
        
    let ucheck = new uCheck.validate(req).scenario(x);
 
    if(ucheck.hasErrors()){
        res.status(400).send({error: ucheck.getErrors()});
        return false;
     
    } else {
        User.findOne({email:req.body.email}).exec(function(err,user){
            if(err)console.log(err);
            if(!user){
                let user=new User
                user.createUser(req.body)
                user.save(function(err){
                    if(err)console.log(err);
                    let v=new Verify
                    let hash=v.createHash(user)
                    v.save()
                    verify.verifyEmail(req,hash)
                })
                res.status(200).send({message:'check your email'});
            }else{
                res.status(400).send({error:'already exist'});
            }
            
        })
       
    }
})
app.post('/api/login',(req,res)=>{
    var x = [
 
        {
            param: 'email',
            label: 'Email',
            required: true,
            type: 'string',
            length: { min: 10 , max: 30},
            regex: /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,4}$/
        },{
            param: 'password',
            label: 'Password',
            required: true,
            type: 'string',
            length: { min:6, max: 20}
        }
    ]
    let ucheck = new uCheck.validate(req).scenario(x);
 
    if(ucheck.hasErrors()){
        res.status(400).send({error: ucheck.getErrors()});
        return false;
     
    } else {
       if(req.body.email&& req.body.password && req.body.email!=undefined && req.body.password!=undefined){
       User.findOne({email:req.body.email}).exec(function(err,result){
           if(err)console.log(err);
           if(result){ 
             if( result.emailVerified== true){
                if(result.comparePass(req.body.password)){
                    let ticket=jwt.sign(req.body)
                    res.status(200).send({ticket:ticket});
                    } else{
                        res.status(400).send({error: 'invalid password'});
                    }  
             }  else{
                res.status(401).send({error: 'email not verified'});
             }       
           }else{
                res.status(404).send({error: 'email does not exit'});
            }
            
         })
    
        }
    }
})


app.get('/api/verify/:code',function(req,res){
    
    var x = [
 
        {
            param: 'code',
            label: 'Code',
            required: true,
            type: 'string',
            length: { min: 10 , max: 50},
            regex: /\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/
        }
    ]
    req.body.code=req.params.code 
    let ucheck = new uCheck.validate(req).scenario(x);
 
    if(ucheck.hasErrors()){
        res.status(400).send({error: ucheck.getErrors()});
        return false;
     
    }else{
        if(req.params.code &&req.params.code!=undefined){
            console.log(req.params.code,"---------------------------");
            
            Verify.findOne({code:req.body.code}).populate('userID').exec(function(err,result){
                if(err)console.log(err);
                if(result!=null ||result!=undefined ){
                   result.userID.emailVerification()
                   result.userID.save()
                   result.remove()
                
                   return res.status('200').send({message:'verified successfully'})
                }
                return res.status('404').send({error:'email does not exit'})
            })
        }else{
            return res.status('400').send({error:'invalid code'})
        }
    }
   
    
});

app.listen(3000,function () {
    console.log('server listening on port 3000')
  })