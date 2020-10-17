const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
//const bcrypt = require('bcryptjs');

//search the index of the post by the id of the post
function post_id_to_post_index(posts, id) {
    console.log("posts", posts)
    console.log("id", id)
    let res;
    posts.forEach((post, i) => {
        if (post.id_post === id) {
            res = i
        }
    })
    console.log("res", res)
    return res
}

exports.init = function (bdd) {

    return {
        getAll: function (req, res) {
            let decoded = jwt.verify(req.headers.authorization.split(' ')[1], process.env.SECRET_KEY);
            const id_follower = decoded.id_user;
            // here we construct the col in db that doesn't exist 
            bdd.query(`SELECT USER.id_user, user.pseudo, user.name, user.avatar, IF(f.id_user, true, false) AS is_followed
            FROM USER LEFT JOIN
             (SELECT * FROM Follow
              RIGHT JOIN USER
              ON USER.id_user = Follow.id_followed
              WHERE id_follower = ${id_follower}) f ON USER.id_user = f.id_user`,
                function (err, result, fields) {
                    if (!err)
                        res.send(result);
                    else
                        res.send(err);
                })
        },

        getByPseudo: function (req, res) {

            try {
                jwt.verify(req.headers.authorization.split(' ')[1], process.env.SECRET_KEY)
                bdd.query(`SELECT pseudo, name FROM user WHERE pseudo = '${req.params.pseudo}'`, function (err, result) {
                    if (!err)
                        res.send(result);
                    else
                        res.send(err)
                })
            } catch (error) {
                res.status(401).send(error) //send the error to the client
            }

        },

        follow: function (req, res) {
            try {
                const id_followed = req.params.id_user //this comes from the parameter of the route
                let decoded = jwt.verify(req.headers.authorization.split(' ')[1], process.env.SECRET_KEY);
                const id_follower = decoded.id_user;

                bdd.query(`INSERT INTO Follow (id_follower, id_followed ) VALUES ('${id_follower}','${id_followed}')`, function (err, result) {
                    console.log(err, result)
                    if (!err)
                        res.send(result);
                    else
                        res.send(err)
                })
            } catch (error) {
                res.status(401).send(error) //send the error to the client
            }
        },

        usersfollowed: function (req, res) {
            try {
                let decoded = jwt.verify(req.headers.authorization.split(' ')[1], process.env.SECRET_KEY);
                const id_follower = decoded.id_user;

                bdd.query(`SELECT id_followed, USER.pseudo, USER.name,USER.avatar FROM Follow 
                RIGHT JOIN USER 
                ON Follow.id_follower = USER.id_user
                where id_follower = ${id_follower}`, //the first one the name of the col in db , the second one is the var = jwt(we defined it before)
                    function (err, result) {
                        console.log(err, result)
                        if (!err)
                            res.send(result);
                        else
                            res.send(err)
                    })
            } catch (error) {
                res.status(401).send(error) //send the error to the client
            }
        },

        allposts: function (req, res) {
            try {
                let decoded = jwt.verify(req.headers.authorization.split(' ')[1], process.env.SECRET_KEY);
                const id_user = decoded.id_user;
                let selectPosts = `SELECT id_followed, POST.id_post, POST.content_post, POST.img_post, POST.date_post
                FROM Follow
                INNER JOIN post ON id_followed = id_user
                WHERE id_follower = ${id_user}
                `
                bdd.query(selectPosts,
                    function (err, result) {
                        //another request to see my posts
                        if (!err) {
                            let myPost = `SELECT POST.id_post, POST.content_post, POST.img_post, POST.date_post
                        FROM POST WHERE id_user = ${id_user}`
                            bdd.query(myPost, function (errTwo, resultTwo) {
                                if (errTwo) {
                                    res.status(500).send(errTwo)
                                } else {
                                    let posts = [...resultTwo, ...result]
                                    const reactionQuery = `SELECT * FROM COMMENT`
                                    bdd.query(reactionQuery, function (errThree, resultThree) {
                                        if (errThree) {
                                            res.status(500).send(errThree)
                                        } else {
                                            resultThree.forEach(comment => {
                                                const postIndex = post_id_to_post_index(posts, comment.id_post) //the index of the post whose id in the comment object
                                                posts[postIndex].comments ?
                                                    posts[postIndex].comments.push(comment) :
                                                    posts[postIndex].comments = [comment] // if there is no comment before, create the key comment and put the comment
                                            })
                                        }
                                        res.send(posts) // coller 2 array ensemble
                                    })
                                    // res.send([...resultTwo, ...result])// coller 2 array ensemble
                                }
                            })

                        } else
                            res.send(err)
                    })
            } catch (error) {
                res.status(401).send(error) //send the error to the client
            }
        },

        login: function (req, res) {
            // console.log("login")
            // console.log("bdd", bdd.query)
            console.log(req.body.username)
            bdd.query('SELECT * FROM user WHERE email= ?', [req.body.email, req.body.password],
                function (err, users, fields) {
                    console.log(users.length)
                    if (!users.length) {
                        console.log('no users found')
                        res.status(404).send('no user found')
                    } else {
                        if (!err) {
                            bcrypt.compare(req.body.password, users[0].password, function (err, result) {
                                if (result) {

                                    let token = jwt.sign({
                                        id_user: users[0].id_user
                                    }, process.env.SECRET_KEY);
                                    res.send(token)
                                } else
                                    res.send('passwords do not match');
                            });
                        } else
                            res.send(err);
                    }

                })
        },
        register: function (req, res) {
            bcrypt.hash(req.body.password, 10, function (err, hash) {
                if (!err) {
                    bdd.query(`INSERT INTO user (name, pseudo, email,  password, avatar) VALUES ('${req.body.name}', '${req.body.pseudo}', '${req.body.email}', '${hash}', '${req.body.avatar}')`, [],
                        function (err, result, fields) {
                            if (!err)
                                res.send(result);
                            else
                                res.send(err);
                        })
                }
            });
        }
    }
}


// if(results.length > 0 ) {
//     return res.send('register', {
//         message :'That email is already in use'
//     })
// }else if(password !== passwordConfirm){
//     return res.send('register', {
//         message :'passwords do not match'
//     })
// }