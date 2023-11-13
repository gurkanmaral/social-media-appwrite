import * as z from "zod"

export const SignupValidation = z.object({
    name:z.string().min(2,{message:"too short"}),
    username:z.string().min(2 ,{message:"too short"}).max(50),
    email: z.string().email(),
    password:z.string().min(8,{message : 'Password must be at least 8 characters'})
    
    
  })
  
  export const SigninValidation = z.object({
    
    email: z.string().email(),
    password:z.string().min(8,{message : 'Password must be at least 8 characters'})
    
    
  })
  
  export const PostValidation = z.object({
    
   caption : z.string().max(2200),
   desc: z.string().max(2200),
   file:z.custom<File[]>(),
   location:z.string().max(100),
    tags: z.string(),
    
    
  })

  export const UserValidation = z.object({
    name: z.string().min(2).max(2200),
    bio:z.string().max(2200),
    profilePictures: z.custom<File[]>(),
    backgroundPictures: z.custom<File[]>(),

  })
  