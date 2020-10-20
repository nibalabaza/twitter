exports.init = function (bdd) {
const express = require('express');
router = express.Router();
const multer = require('multer');
const path = require('path')
const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,"uploads/") //to save the img in the folder uploads
    },
    filename: function(req,file,cb){
        cb(null,file.fieldname+"-" + Date.now() + path.extname(file.originalname)) // to save the date and the extention
    }
})
let upload = multer({storage: storage})

postController = require('../controllers/post').init(bdd);
CommentsController = require('../controllers/comments').init(bdd);

router.post('/create-post', upload.single("postimg"), function(req, res, next){ 
    console.log(req.file)
    if (req.file && req.fileValidationError){
        res.status(400).send(req.fileValidationError)
    } else {
        postController.createPost(req, res, next) //call the function postController
    }
        // if(req.fileValidationError){
        //     res.status(400).send(req.fileValidationError)
        // }else if (!req.file){
        //     res.status(400).send("No image selected")
        // }
        // else if (err instanceof multer.MulterError){
        //     res.status(500).send(err)
        // }else if (err) {
        //     res.status(500).send(err)
        //     }
                        
                  
    // postController.createPost(req, res, next) 
    //call the function postController
});
// router.post('/create-post', postController.createPost);


router.delete('/:id_post', postController.delete_post)
router.post('/:id_post/comments',CommentsController.createComment)
router.post('/:id_post/reactions', postController.createPostReaction)
router.get('/:id_post/reactions', postController.getPostReactions)
router.post('/comments/:id_comment/reactions',CommentsController.createCommentReaction)
 return router ; 
}