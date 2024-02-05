const express=require('express')
const cors=require('cors')
const app=express()
const mongoose=require('mongoose')
const CryptoJS = require('crypto-js');
const loginModel = require('./Login')
const nodemailer = require('nodemailer');
const productsModel = require('./Product');
const cartModel = require('./AddtoCart');
const date=new Date()
mongoose.connect("mongodb+srv://hari:hari@cluster0.1socvoq.mongodb.net/y", { useNewUrlParser: true, useUnifiedTopology: true }).then((res)=>{
    if(res.ConnectionStates.connected==1){
        console.log("connected")
    }
})

const transpo=nodemailer.createTransport({
  service:"gmail",
  host:'smtp.gmail.com',
  port:'587',
  secure:false,
  auth:{
    user:"vhkhari2017@gmail.com",
    pass:"ehcn iogy bbjw kzng"

  }
})
app.use(cors())
app.use(express.urlencoded({extended:true}))
app.use(express.json())
function encrypt(text, key) {
    const ciphertext = CryptoJS.AES.encrypt(text, key).toString();
    return ciphertext;
  }

function decrypt(ciphertext, key) {
    const bytes = CryptoJS.AES.decrypt(ciphertext, key);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
  }
  function differenceInDays(date1, date2) {
    const differenceInMilliseconds = Math.abs(date2 - date1);
  
    const millisecondsInOneDay = 24 * 60 * 60 * 1000;
    const differenceInDays = Math.floor(differenceInMilliseconds / millisecondsInOneDay);
  
    return differenceInDays;
  }  
app.post('/',async (req,res)=>{
    const {email,password} =req.body
    console.log(email,password)
    
    try {
        const datas=await loginModel.aggregate([{$match:{email:email}},{$project:{_id:0}}])
        try{
        if(JSON.parse(decrypt(datas[0].token,password).toString()).status){
            console.log(differenceInDays(new Date("2023-12-01"),new Date(date.toISOString().slice(0,10))))
            const update=await loginModel.updateOne({email:email},{$set:{validToken:"hari"}})
            res.json([{ data: datas }, { status: true }]);
        }
        else{
            res.json([{ data: null }, { status: false }])
        }
        }
        catch{
            res.json([{ data: null }, { status: false }])
        }
      } catch (error) {
        console.error("Error retrieving data:", error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
})

app.post('/signup', async (req, res) => {
  const{email,password}=req.body
    try {
      const existingUser = await loginModel.findOne({ email: email });
  
      if (existingUser) {
        return res.json({ status: false });
      }
      else{
      const authString = encrypt(JSON.stringify({ email: email, status: true }), password);
  
      const newUser = new loginModel({ email: email, token: authString });
  
      const savedUser = await newUser.save(); 
  
      return res.json({ status:true });
      }
    } catch (error) {
      console.error("Error during signup:", error);
      
    }
  });
  
app.post('/otp',async (req,res)=>{
  const {email}=req.body
  const OTP=otpGenerator()
  try {
    const existingUser = await loginModel.findOne({ email: email });

    if (existingUser) {
      return res.json({ otp: 1 });
    }
    else{
      const mailOptions = {
        to: email,
        from: 'vhkhari2017@gmail.com',
        subject: 'OTP from RC',
        text: OTP,
      };
      transpo.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error:', error);
        } else {
          if(info.response.match('OK'))
          res.json({otp:OTP});
        }
      });
}
}
catch{
  console.log("error")
}}
)

function otpGenerator(){
  const num=Math.random().toString()
  return (num.slice(num.length-6,num.length-1))

}
app.get('/products',async(req,res)=>{
  const data=await productsModel.find()
  console.log(data)
  res.json(data)
})
app.post('/cart',async(req,res)=>{
  const {email}=req.body
  const data=await cartModel.find({email:email})
  res.json(data)
})
app.post('/requestProduct',async(req,res)=>{
  const {pid,email}=req.body
  console.log(email)
  const existingUser = await loginModel.findOne({ email: email });
  
      if (!existingUser) {
        return res.json({ data: null });
      }
      else{
      const data=await productsModel.findById(pid)
      res.json(data)
      console.log(existingUser)
      }
})
app.post('/addtocart',async (req,res)=>{
  // const id="659ba45a758dd5ea48a7d469"
  const {pid,email}=req.body
  // const email="vhkhari2017@gmail.com"
  const data=new cartModel({pid:pid,email:email})
  const cart=await data.save()
  res.json(cart)
})
app.post('/removefromcart',async (req,res)=>{
  // const id="659ba45a758dd5ea48a7d466"
  const {pid,email}=req.body
  // const email="vhkhari2017@gmail.com"
  const data = await cartModel.deleteOne({pid:pid,email:email})
  res.json(data)
})
app.listen(5000,()=>{
    console.log("working on 5000")
})