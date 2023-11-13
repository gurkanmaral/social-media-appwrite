import { useParams, Link, useNavigate } from "react-router-dom";
import { multiFormatDateString } from "@/lib/utils";
import { useUserContext } from "@/context/AuthContext";
import { useDeletePost, useGetCurrentUser, useGetPostById } from "@/lib/react-query/queriesAndMutations";
import { Button } from "@/components/ui/button";
import Loader from "@/components/shared/Loader";
import PostStats from "@/components/shared/PostStats";
import Comments from "@/components/shared/Comments";

const PostDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useUserContext();

  const { data: post, isLoading } = useGetPostById(id || '');

 const {data:currentUser,isLoading:currentUserLoading} = useGetCurrentUser()
  
 const {mutate:deletePost,isPending:deletingLoading} = useDeletePost()

 




  const handleDeletePost = () =>{
   
    deletePost(post?.$id)

    !deletingLoading && alert('Post has been deleted')
  

  }
  console.log(user)
  return (
    <div className="flex flex-col flex-1 gap-10 overflow-scroll py-10 px-5 md:p-14 custom-scrollbar items-center  ">
      <div className="hidden md:flex max-w-5xl w-full">
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          className="shad-button_ghost">
          <img
            src={"/assets/icons/left-arrow.svg"}
            alt="back"
            width={24}
            height={24}
          />
          <p className="small-medium lg:base-medium">Back</p>
        </Button>
      </div>

      {isLoading || !post ? (
        <Loader />
      ) : (
        <div className="bg-dark-2 w-full max-w-5xl rounded-[30px] flex flex-col border border-dark-4 xl:rounded-l-[24px]">
        
          <div className="bg-dark-2 flex flex-col gap-5 lg:gap-5 flex-1 items-start p-8 rounded-[30px]">
            <div className="flex-between  w-full">
              <Link
                to={`/profile/${post?.creator.$id}`}
                className="flex items-center gap-3">
                <img
                  src={
                    post?.creator.imageUrl ||
                    "/assets/icons/profile-placeholder.svg"
                  }
                  alt="creator"
                  className="w-8 h-8 lg:w-12 lg:h-12 rounded-full"
                />
                <div className="flex gap-1 flex-col">
                  <div>
                  <p className="base-medium lg:body-bold text-light-1">
                    {post?.creator.name}
                  </p>
                  <p className="text-[14px] mt-[-4px]  overflow-hidden break-words text-gray-400">
                    @{post?.creator.username}
                  </p>
                  </div>
                  <div className="flex gap-2 text-gray-500 ">
                    <p className="subtle-semibold lg:small-regular ">
                      {multiFormatDateString(post?.$createdAt)}
                    </p>
                   {post?.location && <p className="subtle-semibold lg:small-regular">
                    • {post?.location}
                    </p>}
                  </div>
                </div>
              </Link>
              <div className="flex-center gap-4">
                <Link
                  to={`/update-post/${post?.$id}`}
                  className={`${user.id !== post?.creator.$id && "hidden"}`}>
                  <img
                    src={"/assets/icons/edit.svg"}
                    alt="edit"
                    width={24}
                    height={24}
                  />
                </Link>
                {deletingLoading ? (<Loader />) : <Button
                  onClick={handleDeletePost}
                  variant="ghost"
                  className={`ost_details-delete_btn ${
                    user.id !== post?.creator.$id && "hidden"
                  }`}>
                  <img
                    src={"/assets/icons/delete.svg"}
                    alt="delete"
                    width={24}
                    height={24}
                    
                  />
                </Button>}
              </div>
            </div>
            <div className="flex flex-col flex-1 w-full">
            <p className="text-[20px] capitalize font-bold overflow-hidden break-words">{post?.caption}</p>
            <p className="overflow-hidden break-words">{post?.desc}
            </p>
            {/* <ul className="flex gap-1 mt-2">
                {post?.tags.map((tag: string, index: string) => (
                  <li
                    key={`${tag}${index}`}
                    className="text-light-3 small-regular">
                    {tag}
                  </li>
                ))}
              </ul> */}
            </div>
            {post?.imageUrl && <hr className="border w-full  border-dark-4/80 " />}  
            <div className="w-full">
            {post.imageUrl && (
                    post.imageUrl.includes("/preview?") ? (
                        <img src={post.imageUrl} alt="Image" 
                        className="h-80 lg:h-[480px] xl:w-full rounded-[30px] xl:rounded-[24px]  object-cover "
                        />
                    ) : (
                        <video controls className=" rounded-[5px]   object-contain">
                        <source src={post.imageUrl} type="video/mp4"
                         />
                        Your browser does not support the video tag.
                        </video>
                    )
                    )}
          </div>
              <div className="w-full">
              <PostStats post={post} userId={user.id} />        
              </div>     
              <hr className="border w-full  border-dark-4/80 " />  
              <div className="w-full ">
                      <Comments 
                      post={post}
                      user={user.id}
                      currentUser={currentUser}
                      />
                      
           </div> 
          </div>             
        </div>       
      )}  
    </div>
  );
};

export default PostDetails;