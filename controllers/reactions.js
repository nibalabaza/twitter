const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.init = function (db) { 
    return { 
        createComment: (req , res) => { 
            console.log("req.file", req.file)
            
            let decoded = jwt.verify(req.headers.authorization.split(' ')[1], process.env.SECRET_KEY );
                const id_user = decoded.id_user;  
                
            db.query(addPost, (errTwo, rowsTwo, fieldsTwo) => {
                if (errTwo) {
                    console.log(errTwo.sqlMessage);
                    res.send(errTwo.sqlMessage);
                } else {
                    res.send(result)
                    
                }
            })
            }
        }
    
}