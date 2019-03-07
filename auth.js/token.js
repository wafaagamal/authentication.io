var jwt      = require('jsonwebtoken');
let JWTSecret='rZnC3mS8D5N1Xh8irVj0pum2Ba3SXjTL'

module.exports={
    sign:function(data){
       return jwt.sign(data,JWTSecret)
    },
    verfiy:function(ticket){
      return jwt.verify(ticket,JWTSecret)
    }
}