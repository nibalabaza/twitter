const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.init = function (db) {
    return {
        createComment: (req, res) => {
            let decoded = jwt.verify(req.headers.authorization.split(' ')[1], process.env.SECRET_KEY);
            const id_user = decoded.id_user;
            const id_post = req.params.id_post
            const addComment = `INSERT INTO COMMENT (id_user, id_post, content)
            VALUES (${id_user}, ${id_post}, '${req.body.content}')`
            db.query(addComment, (errTwo, rowsTwo, fieldsTwo) => {
                if (errTwo) {
                    console.log(errTwo.sqlMessage);
                    res.send(errTwo.sqlMessage);
                } else {
                    db.query(`SELECT id_comment, id_user, id_post, content FROM COMMENT WHERE id_comment=${rowsTwo.insertId}`, function(er, rs, f){
                        res.send(rs[0])
                    })
                }
            })
        },
        createCommentReaction: (req, res) => {
            let decoded = jwt.verify(req.headers.authorization.split(' ')[1], process.env.SECRET_KEY);
            const id_user = decoded.id_user;
            const id_comment = req.params.id_comment

            const addCommentReaction = `INSERT INTO commentReaction (id_comment, id_user, type)
            VALUES (${id_comment}, ${id_user}, ${req.body.type})`
            db.query(addCommentReaction, (errTwo, rowsTwo, fieldsTwo) => {
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