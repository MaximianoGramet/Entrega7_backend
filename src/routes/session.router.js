import { Router } from "express";
import userModel from "../models/user.model.js"

const router = Router()

const alreadyAuthenticatedMiddleware = (req, res, next) => {
  if (req.session.user) {
    return res.status(401).send({ status: "Error", error: "User already authenticated" });
  }
  next();
};


router.post("/register", alreadyAuthenticatedMiddleware, async (req, res) => {
    const {first_name, last_name, email,age,password} = req.body;
  
    const emailCheck = await userModel.findOne({email});
  
    if(emailCheck){
      return res.status(409).send({status:'error', msg:'User already exist'})
    }
  
    const user = {
      first_name,
      last_name,
      email,
      age,
      password
    }
    const result = await userModel.create(user)
    res.send({status:"success", msg:"Succes at creating user. ID: " + result.id})
})

router.post("/login", alreadyAuthenticatedMiddleware, async (req, res) => {

    const {email,password}=req.body;
    const user = await userModel.findOne({email,password})
    let rol; 
  
    if(!user) return res.status(401).send({status:"Error",error:"Incorrect crendentials"})
    if(email == "adminCoder@coder.com"&& password == "adminCod3r123"){
      rol = "admin"
    }else{
      rol="user"
    }
    req.session.user = {
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      age: user.age,
      rol: rol
    }
  
    res.send({status:'success', payload: req.session.user, message:'Succesful login'})
})

  

router.get('/logout',  (req,res)=>{
    req.session.destroy(err =>{
        if(!err) return res.status(200).send("deslogueo exitoso")
        else res.send("fallo el deslogueo")
    })
})

export default router;