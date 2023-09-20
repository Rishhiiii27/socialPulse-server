const requireUser = require('../middlewares/requireUser')
const router = require('express').Router()
const userController = require('../controllers/userController')


router.post('/follow',requireUser,userController.followOrUnfollowUserController)
router.get('/getFeedData',requireUser,userController.getPostOfFollowing)
router.get('/getMyPosts',requireUser,userController.getMyPosts)
router.get('/getUserPosts',requireUser,userController.getUserPosts)
router.delete('/',requireUser,userController.deleteMyProfile)
router.get('/getMyInfo',requireUser,userController.getMyInfo)
router.put('/',requireUser,userController.updateUserProfile);
router.post('/getUserProfile',userController.getUserProfile);
module.exports=router;