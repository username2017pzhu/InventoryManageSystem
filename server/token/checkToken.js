const jwt = require('jsonwebtoken');
module.exports=function(token,screct){
// get the decoded payload and header
const decoded = jwt.verify(token,screct);
return decoded
}
