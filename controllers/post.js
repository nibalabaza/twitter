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

            delete_post: async function(req, res){
                try{
                    const auth_headers = req.headers.authorization
                    const token_string = auth_headers.split(' ')[1]
                    let decoded = jwt.verify(token_string, process.env.SECRET_KEY);
                    const id_user = decoded.id_user;
                    const {id_post} = req.params;
                    const db_result = await db.q(`SELECT id_user FROM POST WHERE id_post=${id_post}`)
                    const id_user_in_db = db_result[0].id_user
                    if(id_user !== id_user_in_db){
                        res.status(500).send('user is not author: no delete')
                        return
                    }
                    try{
                        const query_return = await db.q(`DELETE FROM POST WHERE id_post=${id_post}`)
                        res.send(`post ${id_post} deleted`)
                    }catch(db_delete_error){
                        console.error(db_delete_error)
                        console.error('db could not delete post')
                        res.status(500).send('db could not delete post')
                        return
                    }
                }
                catch(jwt_verify_error){
                    console.error('jwt_ver_error', jwt_verify_error)
                    res.status(500).send('jwt decode error')
                    return
                }
            },

            getPostReactions: function(req, res){
                let decoded = jwt.verify(req.headers.authorization.split(' ')[1], process.env.SECRET_KEY);
                const id_post = req.params.id_post
                const sql_string = `SELECT * FROM postReaction WHERE id_post = ${id_post}`
                db.query(sql_string, function(errors, results){
                    if(errors){
                        res.status(500).send('could not get post reactions')
                    }else{
                        res.send(JSON.stringify(results))
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
   
        
    