import { Schema,model } from "mongoose";

const postSchema = new Schema({
  title: {type:String, required:true},
  descripcion: {type:String, required:true},
  price: {type:Number, required:true},
  thumbnail: {type:String, required:false},
  code: {type:String, required:true},
  stock: {type:Number, required:true},
})

const postModel = model("products", postSchema);

export{postModel};