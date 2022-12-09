//Assignment: a. Make a POST API with URL Query ,Body & Header Properties. b. Make a file upload API support PNG,JPG file only c. Make a file Download API, that can download file from application directory 

const express = require('express')
const multer  = require('multer')
const path=require('path')

const app = express()

//a. Make a POST API with URL Query ,Body & Header Properties.
app.post('/user',(req,res)=>{
   // const name=req.query.name;
   // const city=req.query.city;
   const {name,city}=req.query;

   res.send(`<h2>My name is ${name} and I live in ${city}<h2>`)
})
app.post('/',(req,res)=>{
   const age=req.header('age');
   const position=req.header('position')
   res.send(`<h2>Prince age is ${age} and hios position is ${position}<h2>`)
})

//b. Make a file upload API support PNG,JPG file only

const GALLERY_FOLDER='./uploads'

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
      cb(null,GALLERY_FOLDER)
   },
   filename:(req,file,cb)=>{
      const fileExt=path.extname(file.originalname)
      const fileName=file.originalname
                        .replace(fileExt,"")
                        .toLowerCase()
                        .split(" ")
                        .join("-") + "-" + Date.now();
      cb(null,fileName + fileExt)
   }
})

// prepare the multer object

const upload=multer({
   storage:storage,
   // limits:{
   //    fileSize:2000000
   // },
   fileFilter:(req,file,cb)=>{
      if(file.fieldname==='gallery'){
         if(file.mimetype==='image/png'|| file.mimetype==='image/jpg'||file.mimetype==='image/jpeg'){
            cb(null,true)
         }else{
            cb(new Error("only .jpg and .png file allowed"))
         }
      }else{
         cb(new Error('There was another error'))
      }
   }
})

const finalUpload= upload.fields([{name:'gallery',maxCount: 2}])
app.post ('/image',finalUpload,(req,res)=>{
   //console.log(req.files);
   res.send("file uploads in Field successsfully")
})

// error handeling
app.use((err,req,res,next)=>{
   if(err){
      if(err instanceof multer.MulterError){
         res.status(500).send('There was an upload error')
      }else{
         res.status(500).send(err.message)
      }
   }else{
      res.send('Success upload')
   }
})

//c. Make a file Download API, that can download file from application directory 
     app.get('/download',(req,res)=>{
     res.download('./uploads/man-1670617972991.jpg')
    })

// chec
app.get('/',(req,res)=>{
  res.send('This is home page')
})

// server connected
app.listen(5000,()=>{
   console.log('Server is running at port 5000');
})

