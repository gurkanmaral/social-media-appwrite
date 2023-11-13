import { INewPost, INewUser, IUpdatePost, IUpdateUser } from "@/types";
import { account, appwriteConfig, avatars, databases, storage } from "./config";
import {ID} from "appwrite"
import {Query} from "appwrite"

export async function createUserAccount(user:INewUser){

    try {
        const newAccount = await account.create(
            ID.unique(),
            user.email,
            user.password,
            user.name
        )   

        if(!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(user.name);

        const newUser = await saveUserTODB({
            accountId: newAccount.$id,
            name:newAccount.name,
            email:newAccount.email,
            username: user.username,
            imageUrl:avatarUrl,

        })
        return newUser;
    } catch (error) {
        console.log(error);
        return error;
    }
}


export async function saveUserTODB(user:{
    accountId:string;
    name:string;
    email:string;
    imageUrl:URL;
    username?:string;
}) {

    try {
            const newUser = await databases.createDocument(
                appwriteConfig.databaseId,
                appwriteConfig.userCollectionId,
                ID.unique(),
                user,
            )

            return newUser
    } catch (error) {
        console.log(error);
    }
}


export async function signInAccount(user:{email:string; password:string}){

    try {
        const session = await account.createEmailSession(user.email,user.password)

        return session
    } catch (error) {
        console.log(error)
    }
}
export async function signOutAccount(){

    try {
       const session = await account.deleteSession("current");

       return session;
    } catch (error) {
        console.log(error)
    }
}


// ============================== GET ACCOUNT
export async function getAccount() {
    try {
      const currentAccount = await account.get();
  
      return currentAccount;
    } catch (error) {
      console.log(error);
    }
  }
export async function getCurrentUser(){
    try {
        
        const currentAccount = await getAccount();

        if(!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        )
        if(!currentUser) throw Error;

        return currentUser.documents[0];

    } catch (error) {
        console.log(error)
    }
}

export async function getRightbarUsers(){

    try {
        const users = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.orderDesc('$createdAt'),Query.limit(10)]
        )
        if(!users) throw Error

        return users
    } catch (error) {
        console.log(error)
    }
}

export async function createPost(post:INewPost){

    try {
        let uploadedFile = null;
        let fileUrl = null;

        //upload imagefileType
       if(post.file && post.file[0]){
         uploadedFile = await uploadFile(post.file[0])

        if(!uploadedFile) throw Error;
        
        if(post.file[0].type === "video/mp4"){
            fileUrl= getFileView(uploadedFile.$id)
        }else{
            fileUrl = getFilePreview(uploadedFile.$id)
        }
         

        if(!fileUrl) {
            deleteFile(uploadedFile.$id);
            throw new Error
        }

    }
   
        //save post
        const tags = post.tags?.replace(/ /g,'').split(',') ||[];
        
        const newPost = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            ID.unique(),
            {
                creator: post.userId,
                caption:post.caption,
                desc: post.desc,
                imageUrl:fileUrl || null,
                imageId:uploadedFile ? uploadedFile.$id : null,
                location:post.location,
                tags:tags
            }
        )
        if(!newPost) {
            if (uploadedFile) {
                await deleteFile(uploadedFile.$id);
              }
            throw new Error
        }
        return newPost
    } catch (error) {
        console.log(error)
    }
}

export async function uploadFile(file:File) {
    try {
        
        const uploadedFile = await storage.createFile(
            appwriteConfig.storageId,
            ID.unique(),
            file
        )
        return uploadedFile;
        
    } catch (error) {
        console.log(error)
    }
}
export  function getFileView(fileId: string) {
  
    try {
         
            const imageUrl = storage.getFileView(
                appwriteConfig.storageId,
                fileId,
            );
            return imageUrl;
        
    } catch (error) {
        console.log(error);
    }
}
export  function getFilePreview(fileId: string) {
    try {
      
         
            const imageUrl = storage.getFilePreview(
                appwriteConfig.storageId,
                fileId,
                2000,
                2000,
                "top",
                100
            );
            return imageUrl;
        
    } catch (error) {
        console.log(error);
    }
}
export async function deleteFile(fileId:string) {
    
    try {
        await storage.deleteFile(appwriteConfig.storageId,fileId);

        return {status: 'ok'}
    } catch (error) {
        console.log(error)
    }
}

export async function getRecentPosts() {
    
    const posts = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        [Query.orderDesc('$createdAt'), Query.limit(20)]
    )
    if(!posts) throw Error;

    return posts

}
export async function getNewRelations () {

    const relations = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.relationCollectionId,
        [Query.orderDesc('$createdAt'), Query.limit(20)]
    )
    if(!relations)throw Error;

    return relations
}

export async function LikePost(postId:string,likesArray:string[]) {

    try {
        const updatedPost = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            postId,
            {
                likes: likesArray
            }
        )
        if(!updatedPost)throw Error;

        return updatedPost
    } catch (error) {
        console.log(error)
    }
    
}
export async function LikeComment(commentId:string,likesArray:string[]){
    try {
        const updatedPost = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.commentCollectionId,
            commentId,
            {
                commentLikes:likesArray
            }
        )
        if(!updatedPost)throw Error;

        return updatedPost
    } catch (error) {
        console.log(error)
    }
}

export async function savePost(postId:string,userId:string) {

    try {
        const updatedPost = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.savesCollectionId,
            ID.unique(),
            {
                user:userId,
                post:postId,
            }
        )
        if(!updatedPost)throw Error;

        return updatedPost
    } catch (error) {
        console.log(error)
    }
    
}

export async function deleteSavedPost(savedRecordId:string) {

    try {
        const statusCode = await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.savesCollectionId,
            savedRecordId,
        )
        if(!statusCode)throw Error;

        return {status:'ok'}
    } catch (error) {
        console.log(error)
    }
    
}

export async function getPostById(postId:string){

    try {
        const post = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            postId
        )
        return post
    } catch (error) {
        console.log(error)
    }
}

export async function getUserById(userId:string) {
    
    try {
        const user = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            userId
        )    
        if(!user) throw Error;
        return user
    } catch (error) {
        console.log(error)
    }
    
}

export async function updateUser(user:IUpdateUser){
    const hasFileToUpdate = user?.profilePictures?.length > 0;
    const hasBgUpdate=  user?.backgroundPictures?.length > 0;

    try {
        
        let image = {
            imageUrl:user.imageUrl,
            imageId:user.imageId,
        }
        let bgImage = {
            bgImageUrl: user.bgImageUrl,
            bgImageId:user.bgImageId,
        }

        if(hasFileToUpdate){
            const uploadedFile = await uploadFile(user.profilePictures[0])
            
            if(!uploadedFile) throw Error;

            const fileUrl = getFilePreview(uploadedFile.$id)

            if(!fileUrl) {
                deleteFile(uploadedFile.$id);
                throw new Error
            }
            image = {...image, imageUrl:fileUrl,imageId:uploadedFile.$id}
        }
        if(hasBgUpdate){
            const uploadedFile = await uploadFile(user.backgroundPictures[0])

            if(!uploadedFile) throw Error;

            const fileUrl = getFilePreview(uploadedFile.$id)
            
            if(!fileUrl) {
                deleteFile(uploadedFile.$id);
                throw new Error
            }
            bgImage ={...bgImage,bgImageUrl:fileUrl,bgImageId:uploadedFile.$id }
            
        }
        const updatedUser = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            user.userId,
            {
                name:user.name,
                bio:user.bio,
                imageUrl:image.imageUrl,
                imageId:image.imageId,
                bgImageUrl:bgImage.bgImageUrl,
                bgImageId:bgImage.bgImageId,
            }
        )
        if(!updatedUser) {
            await deleteFile(user.imageId)
            throw Error;
        }
        return updatedUser
    } catch (error) {
        console.log(error)
    }
}

export async function updatePost(post:IUpdatePost){

    const hasFileToUpdate = post.file.length > 0;
    try {
    let fileUrl = null;
        let image = {
            imageUrl:post.imageUrl,
            imageId: post.imageId,
        }
        if(hasFileToUpdate){
            const uploadedFile = await uploadFile(post.file[0])
            
            if(!uploadedFile) throw Error;

        
            if(post.file[0].type === "video/mp4"){
                fileUrl= getFileView(uploadedFile.$id)
            }else{
                fileUrl = getFilePreview(uploadedFile.$id)
            }

            if(!fileUrl) {
                deleteFile(uploadedFile.$id);
                throw new Error
            }
            image = {...image, imageUrl:fileUrl,imageId:uploadedFile.$id}
            }
            

        //save post
        const tags = post.tags?.replace(/ /g,'').split(',') ||[];
        
        const updatedPost = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
           post.postId,
            {
                caption:post.caption,
                desc:post.desc,
                imageUrl:image.imageUrl,
                imageId:image.imageId,
                location:post.location,
                tags:tags
            }
        )
        if(!updatedPost) {
            await deleteFile(post.imageId)
            throw Error;
        }
        return updatedPost
    } catch (error) {
        console.log(error)
    }
}

export async function deletePost(postId:string){

    if(!postId ) throw Error;

    

    try {
       
        await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            postId
        )
        return {status:'ok'}
    } catch (error) {
        console.log(error)
    }
}

export async function getInfinitePost({pageParam}:{pageParam:number}){

    const queries: any[] = [Query.orderDesc('$createdAt'),Query.limit(5)]

    if(pageParam){
        queries.push(Query.cursorAfter(pageParam.toString()))

    }
    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            queries
        )
        if(!posts)throw Error;
        return posts
    } catch (error) {
        console.log(error)
    }
}
export async function getInfiniteUsers({pageParam}:{pageParam:number}){

    const queries: any[] = [Query.orderDesc('$createdAt'),Query.limit(5)]

    if(pageParam){
        queries.push(Query.cursorAfter(pageParam.toString()))

    }
    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            queries
        )
        if(!posts)throw Error;
        return posts
    } catch (error) {
        console.log(error)
    }
}



export async function searchPosts(searchTerm:string){

    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
           [Query.search('desc',searchTerm)]
        )
        if(!posts)throw Error;
        return posts
    } catch (error) {
        console.log(error)
    }
}

export async function searchUsers(searchTerm:string){

    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
           [Query.search('name',searchTerm)]
        )
        if(!posts)throw Error;
        return posts
    } catch (error) {
        console.log(error)
    }
}


export async function addRelations(followerId:string,followedId:string){

    try {
        const updatedUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.relationCollectionId,
            ID.unique(),
            {
                followers:followerId,
                followed:followedId,
            }
        )
        if(!updatedUser) throw Error;

        return updatedUser


    } catch (error) {
        console.log(error)
    }
}
export async function addMessage(senderId:string,receiverId:string,message:string){

    try {
        const updatedUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.chatCollectionId,
            ID.unique(),
            {
                senderId:senderId,
                receiverId:receiverId,
                message:message,
            }
        )
        if(!updatedUser) throw Error;

        return updatedUser
    } catch (error) {
        console.log(error)
    }
}
export async function addComment(userId:string,postId:string,comment:string){
    
    try {
        const updatedPost = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.commentCollectionId,
            ID.unique(),
            {
               userId:userId,
               postId:postId,
               comment:comment,
            }
        )
        if(!updatedPost) throw Error;
        return updatedPost
    } catch (error) {
        console.log(error)
    }
}


export async function getComments(postId:string){
    try {
        const comments = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.commentCollectionId,
            [Query.equal('postId',[postId])]
            
        )
        if(!comments)throw Error;
            
        return comments
    } catch (error) {
        console.log(error)
    }
}

export async function deleteRelation(savedRecordId:string) {

    try {
        const statusCode = await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.relationCollectionId,
            savedRecordId,
        )
        if(!statusCode)throw Error;

        return {status:'ok'}
    } catch (error) {
        console.log(error)
    }
    
}


export async function getUsersSavedPost (id:string){

    const posts = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.savesCollectionId,
        [Query.equal("post",[id]),Query.orderDesc('$createdAt'),Query.limit(5)]
    )
    if(!posts)throw Error;

        return posts

}

export async function getInfiniteSavedPosts(pageParam:number,id:string) {
    
    
    const queries: any[] = [Query.equal("user", [id]),Query.orderDesc('$createdAt'),Query.limit(1),]
   
    if(pageParam){
        queries.push(Query.cursorAfter(pageParam.toString()))
    }

        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.savesCollectionId,
            queries
  
        )
        if(!posts)throw Error;

        return posts       

}
export async function  getUserChats(receiverId:string,senderId:string){

    const chats = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.chatCollectionId,
        [Query.equal("senderId",[receiverId,senderId]), 
        Query.equal("receiverId",[receiverId,senderId])]
    )
    if(!chats) throw Error
    return chats
}
export async function getInfiniteUsersPost(pageParam:number,id:string) {
    
    
    const queries: any[] = [Query.equal("creator", [id]),Query.orderDesc('$createdAt'),Query.limit(1),]
   
    if(pageParam){
        queries.push(Query.cursorAfter(pageParam.toString()))
    }

        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            queries
  
        )
        if(!posts)throw Error;

        return posts
        
   

}
