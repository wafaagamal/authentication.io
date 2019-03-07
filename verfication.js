let config=require('./config.js')
 
module.exports={
    verifyEmail:function(req,hash){
        console.log(hash,"=================hash=====================");
        
        host=req.get('host');
        const sgMail = require('@sendgrid/mail');
        sgMail.setApiKey(config.APIKEY);
        const msg = {
          to: req.body.email,
          from: 'login@example.com',
          subject: 'Sending with SendGrid is Fun',
          text: "http://"+req.get('host')+"/api/verify/"+hash
         };
        sgMail.send(msg);
        console.log(msg.text);
        
    }
}




