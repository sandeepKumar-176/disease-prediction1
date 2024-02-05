const express = require('express');
const mongoose = require('mongoose');
const userLogin=require('./Model/userLogin')
const app = express();
const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://sandeep12:Sandeep123@cluster0.csrxvjy.mongodb.net/sample";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json())
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    });

app.post('/', async (req, res) => {
    /* const email = "hari@gmail.com";
    const password = "hari"; */
    const {email,password}=req.body
    const login= await userLogin.find({email:email,password:password})
    console.log(login)
    if(login.length>0)
    res.json({ "data": login });
    else
    res.json({"data":false})/*  */
});

app.post('/signup', async (req, res) => {
         const{email,password}=req.body
        /* const email="sandeep@gmail.com"
        const password="sandeep" */
          try {
            const existingUser = await userLogin.findOne({ email: email });
            if (existingUser) {
              return res.json({ status: false });
            }
            else{
            const newUser = new userLogin({ email: email, password: password });
            const savedUser = await newUser.save(); 
            return res.json({ status:true });
            }
          } catch (error) {
            console.error("Error during signup:", error);
            
          }
});
app.get('/image/:id', async (req, res) => {
    try {
      const image = await Image.findById(req.params.id);
  
      if (!image) {
        return res.status(404).send('Image not found');
      }
  
      res.set('Content-Type', image.contentType);
      res.send(Buffer.from(image.data, 'base64')); // Convert base64 to buffer
    } catch (error) {
      res.status(500).send(error.message);
    }
  });
  
app.get('/img',async (req,res)=>{

    try{
    const data=await userLogin.find({email:'hari@gmail.com'})
    // console.log(data)
    const img = new Image();
    img.src = data[0].base64;
    res.json({status:true})
    }
    catch{
    res.json({status:404})   
    }
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
