const express  = require('express')
const router   = express.Router()
const { ensureAuth}=require('../middleware/auth')

const Code= require('../models/Code')




router.get('/add',ensureAuth,(req,res)=>{
    res.render('code/add')
})

router.post('/',ensureAuth,async(req,res)=>{
    try {
       req.body.user=req.user.id
       await Code.create(req.body)
       res.redirect('/dashboard')
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})

router.get('/',ensureAuth,async(req,res) => {
    try {
        const code=await Code.find({status:'public'})
        .populate('user')
        .sort({createdAt:'desc'})
        .lean()
        res.render('code/index',{
            code,
        })

    } catch (err) {
        console.error(err)
        res.render('error/500') 
    }
})

router.get('/:id',ensureAuth,async(req,res)=>{
    try {
        let code =await Code.findById(req.params.id)
        .populate('user')
        .lean()
        if(!code){
            res.render('error/404')
        }
        res.render('code/show',{
            code
        })
    } catch (err) {
        console.error(err)
        return res.render('error/404')    
    }
})


router.get('/edit/:id',ensureAuth,async(req,res)=>{
try {
    const code =await Code.findOne({
        _id:req.params.id
    }).lean()
    if(!code){
        return res.render('error/404')
    }

    if(code.user!=req.user.id){
        res.redirect('/code')
    }
    else{
        res.render('code/edit',{
            code,
        })
    }   
} catch (err) {
    console.error(err)
    return res.render('error/500')   
}
})

router.put('/:id',ensureAuth,async(req,res)=>{
try {
    let code=await Code.findById(req.params.id).lean()

    if(!code){
     return res.render('error/404')
    }
    if(code.user!=req.user.id){
     res.redirect('/code')
    }
    else{
      code =await Code.findOneAndUpdate({_id: req.params.id},req.body,{
         new:true,
         runValidators:true,
      })
      res.redirect('/dashboard')
    }
} catch (err) {
    console.error(err)
    return res.render('error/500')
}

})

router.delete('/:id', ensureAuth, async (req, res) => {
    try {
      await Code.deleteOne({ _id: req.params.id });
      res.redirect('/dashboard');
    } catch (err) {
      console.error(err);
      return res.render('error/500');
    }
  });

module.exports=router 


