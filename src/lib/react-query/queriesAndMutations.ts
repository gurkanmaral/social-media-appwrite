import {
    useQuery,
    useMutation,
    useQueryClient,
    useInfiniteQuery,
} from '@tanstack/react-query'
import { LikeComment, LikePost, addComment, addMessage, addRelations, createPost, createUserAccount, deletePost, deleteRelation, deleteSavedPost, getComments, getCurrentUser, getInfinitUsersPost, getInfinitePost, getInfiniteSavedPosts, getInfiniteUsers, getInfiniteUsersPost, getNewRelations, getPostById, getRecentPosts, getRightbarUsers, getSavedPost, getUserById, getUserChats, getUsersSavedPost, savePost, searchPosts, searchUsers, signInAccount, signOutAccount, updatePost, updateUser } from '../appwrite/api'
import { INewPost, INewUser, IUpdatePost, IUpdateUser } from '@/types'

import { QUERY_KEYS } from './queryKeys'

export const useCreateUserAccount = () =>{
    
    return useMutation({
        mutationFn:(user:INewUser) => createUserAccount(user)
    })
}

export const useSignInAccount = () =>{
    
    return useMutation({
        mutationFn:(user:{
        email:string;
        password:string;
    }) => signInAccount(user)
    })
}

export const useSignOutAccount = () =>{
    
    return useMutation({
        mutationFn: signOutAccount
    })
}


export const useCreatePost = () =>{

    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (post:INewPost) => createPost(post),
        onSuccess: () =>{
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_INFINITE_POSTS]
            })
        }
    })
}

export const useGetRecentPosts = () =>{
    return useQuery({
        queryKey:[QUERY_KEYS.GET_RECENT_POSTS],
        queryFn: getRecentPosts,
    })
}

export const useGetRecentRelations = () =>{

    return useQuery({
        queryKey:[QUERY_KEYS.GET_NEW_RELATIONS],
        queryFn:getNewRelations,
    })
}

export const useLikeComment= () =>{
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn:({commentId,likesArray}: {commentId:string;likesArray:string[]})=> LikeComment(commentId,likesArray),
        onSuccess:()=>{
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POST_COMMENTS]
            })
        }
    })
}


export const useLikePost = () =>{

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({postId,likesArray}:{postId:string; likesArray:string[]}) =>LikePost(postId,likesArray),
        onSuccess:(data)=>{
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POST_BY_ID,data?.$id]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER]
            })

        }
    })

}
export const useSavePost = () =>{

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({postId,userId}:{postId:string; userId:string}) =>savePost(postId,userId),
        onSuccess:()=>{
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER]
            })

        }
    })
    
}
export const useAddChat = () =>{
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn:({senderId,receiverId,message}:{senderId:string; receiverId:string; message:string})=> addMessage(senderId,receiverId,message),
        onSuccess:() =>{
            queryClient.invalidateQueries({
                queryKey:[QUERY_KEYS.GET_USERS_CHATS]
            })
        }
    })
}
export const useAddComment = () =>{
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn:({userId,postId,comment}:{userId:string; postId:string;comment:string}) => addComment(userId,postId,comment),
        onSuccess:()=> 
            queryClient.invalidateQueries({
            queryKey:[QUERY_KEYS.GET_POST_COMMENTS]
        })
    })
}
export const useGetComments = (postId:string) =>{

    return useQuery({
        queryKey:[QUERY_KEYS.GET_POST_COMMENTS,postId],
        queryFn:() => getComments(postId),
        enabled:!!postId
    })
}
export const useAddRelation = () =>{
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({followerId,followedId}: {followerId:string; followedId:string}) => addRelations(followerId,followedId),
        onSuccess: () =>{
            queryClient.invalidateQueries({
                queryKey:[QUERY_KEYS.GET_RELATIONS]
            })
            queryClient.invalidateQueries({
                queryKey:[QUERY_KEYS.GET_NEW_RELATIONS]
            })
            queryClient.invalidateQueries({
                queryKey:[QUERY_KEYS.GET_RIGHT_USERS]
            })
        }
        
    })
}
export const useDeleteRelation = () =>{

    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (savedRecordId:string) => deleteRelation(savedRecordId),
        onSuccess: () =>{
            queryClient.invalidateQueries({
                queryKey:[QUERY_KEYS.GET_RELATIONS]
            })
        }
    })
}

export const useDeleteSavePost = () =>{

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (savedRecordId:string) =>deleteSavedPost(savedRecordId),
        onSuccess:()=>{
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER]
            })

        }
    })

}

export const useGetCurrentUser = () =>{
    return useQuery({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
        queryFn: getCurrentUser
    })
}

export const useGetPostById = (postId:string) =>{
    return useQuery({
        queryKey:[QUERY_KEYS.GET_POST_BY_ID,postId],
        queryFn: ()=>getPostById(postId),
        enabled: !!postId
    })
}

export const useGetUserById = (userId:string) => {
    return useQuery({
        queryKey:[QUERY_KEYS.GET_USER_BY_ID,userId],
        queryFn:() => getUserById(userId),
        enabled: !!userId
    })
}

export const useUpdatePost = () =>{
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (post:IUpdatePost) => updatePost(post),
        onSuccess: (data) =>{
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POST_BY_ID,data?.$id]
            })
        }
    })

}
export const useUpdateUser = () =>{
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn:(user:IUpdateUser)=> updateUser(user),
        onSuccess:(data)=>{
            queryClient.invalidateQueries({
                queryKey:[QUERY_KEYS.GET_USER_BY_ID,data?.$id]
            })
        }
    })
}




export const useDeletePost = () =>{
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (postId:string) => deletePost(postId),
        onSuccess: () =>{
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_INFINITE_POSTS]
            })
        }
    })

}

export const useGetPosts = () =>{
    return useInfiniteQuery({
        queryKey:[QUERY_KEYS.GET_INFINITE_POSTS],
        queryFn: getInfinitePost,
        getNextPageParam:(lastPage)=>{
            if(lastPage && lastPage.documents.length === 0) return null;

            const lastId = lastPage?.documents[lastPage?.documents.length -1].$id;

            return lastId;
        }
    })
}
export const useGetUserChats = (receiverId:string,senderId:string)=>{

    return useQuery({
        queryKey:[QUERY_KEYS.GET_USERS_CHATS,receiverId,senderId],
        queryFn:()=> getUserChats(receiverId,senderId),
    })
}
export const useGetSavedPost = (id:string) =>{
    
    return useInfiniteQuery({
        queryKey:[QUERY_KEYS.GET_INFINITE_SAVED_POSTS,id],
        queryFn:({pageParam}: {pageParam:number})=> getInfiniteSavedPosts(pageParam,id),
        getNextPageParam:(lastPage)=>{
            if(lastPage && lastPage.documents.length === 0) return null;

            const lastId = lastPage?.documents[lastPage?.documents.length -1].$id;

            return lastId;
        }
    })
}
export const useGetUsersSavedPost = (id:string)=>{
    return useQuery({
        queryKey:[QUERY_KEYS.GET_USERS_SAVED_POSTS,id],
        queryFn: () =>getUsersSavedPost(id),
    })
}

export const useGetUserPosts = (id:string) =>{
    
    return useInfiniteQuery({
        queryKey:[QUERY_KEYS.GET_INFINITE_USER_POSTS,id],
        queryFn: ({pageParam}:{pageParam:number})=> getInfiniteUsersPost(pageParam,id),
        getNextPageParam:(lastPage)=>{
            if(lastPage && lastPage.documents.length === 0) return null;

            const lastId = lastPage?.documents[lastPage?.documents.length -1].$id;

            return lastId;
        }
    })

}

export const useRightBarUsers = () =>{
    return useQuery({
        queryKey:[QUERY_KEYS.GET_RIGHT_USERS],
        queryFn:getRightbarUsers
    })
}

export const useGetUsers = () =>{
    return useInfiniteQuery({
        queryKey:[QUERY_KEYS.GET_USERS],
        queryFn: getInfiniteUsers,
        getNextPageParam:(lastPage)=>{
            if(lastPage && lastPage.documents.length === 0) return null;
            const lastId = lastPage?.documents[lastPage?.documents.length -1].$id;

            return lastId;
        }
    })
}

export const useSearchUsers = (searchTerm:string)=>{
    return useQuery({
        queryKey:[QUERY_KEYS.GET_USER_BY_SEARCH,searchTerm],
        queryFn: () => searchUsers(searchTerm),
        enabled: !! searchTerm
    })
}

export const useSearchPosts = (searchTerm:string) =>{

    return useQuery({
        queryKey:[QUERY_KEYS.SEARCH_POSTS,searchTerm],
        queryFn: () => searchPosts(searchTerm),
        enabled: !!searchTerm
    })
}
