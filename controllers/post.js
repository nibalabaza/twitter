const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.init = function (db) { 
    return { 
        createPost : (req , res) => { 
            console.log("req.file", req.file)
            
            let decoded = jwt.verify(req.headers.authorization.split(' ')[1], process.env.SECRET_KEY );
                const id_user = decoded.id_user;  
                const img_name = req.file ? `'${req.file.filename}'` : null
            let addPost = `INSERT INTO POST (content_post, img_post, id_user) 
            VALUES ('${req.body.ContentPost}', ${img_name}, '${id_user}')`
            db.query(addPost, (errTwo, rowsTwo, fieldsTwo) => {
                if (errTwo) {
                    console.log(errTwo.sqlMessage);
                    res.send(errTwo.sqlMessage);
                } else {
                    console.log("rowsTwo", rowsTwo)
                    console.log("fieldsTwo", fieldsTwo)
                    //select the rows in post whose id was given at insert
                    db.query(`SELECT * FROM POST WHERE id_post = '${rowsTwo.insertId}'`, (err, result, field)=>{ 
                        console.log("err", err)
                        console.log("result", result)
                        if(err){
                            res.status(500).send(err.sqlMessage)
                        }else {
                            res.send(result)
                            // res.json({})
                        }
                    })
                }
            })
            },

            createPostReaction: (req, res) => {
                let decoded = jwt.verify(req.headers.authorization.split(' ')[1], process.env.SECRET_KEY);
                const id_user = decoded.id_user;
                const id_post = req.params.id_post
    
                const addPostReaction = `INSERT INTO postReaction (id_post, id_user, type)
                VALUES (${id_post}, ${id_user}, ${req.body.type})`
                db.query(addPostReaction, (errTwo, rowsTwo, fieldsTwo) => {
                    if (errTwo) {
                        console.log(errTwo.sqlMessage);
                        res.send(errTwo.sqlMessage);
                    } else {
                        res.send(rowsTwo)
    
                    }
                })
            }
        }
    
}
   
        
    