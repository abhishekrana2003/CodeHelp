const express  = require('express')
const router   = express.Router()
const { ensureAuth,ensureGuest}=require('../middleware/auth')

const Code= require('../models/Code')


router.get('/',ensureGuest,(req,res)=>{
    res.render('login',{
        layout:'login',
    })
})

router.get('/dashboard',ensureAuth,async(req,res)=>{
    try{
        const code =await Code.find({user:req.user.id}).lean()
        res.render('dashboard',{
            name:req.user.firstName,
            code
        })

    }
    catch(err){
      console.error(err)
      res.render('error/500')
    }

   

})

module.exports=router


