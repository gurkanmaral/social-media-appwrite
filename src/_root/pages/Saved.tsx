import { useGetCurrentUser, useGetSavedPost } from '@/lib/react-query/queriesAndMutations'
import { useInView } from 'react-intersection-observer';
import {useEffect} from "react"
import PostCard from '@/components/shared/PostCard';
import Loader from '@/components/shared/Loader';

const Saved = () => {
  const {ref,inView} = useInView();
  const {data:currentUser} = useGetCurrentUser();
  const {data:posts,fetchNextPage,hasNextPage,isPending:isLoading} = useGetSavedPost(currentUser?.$id || "")
  
  useEffect(()=>{
    if(inView ) fetchNextPage();
  },[inView])

  


  return (
    <div className='flex flex-1 '>
        <div className='home-container'>
          <div className='home-posts'> 
          <h2 className='h3-bold md:h2-bold text-left w-full'>
              Saved Posts

            </h2>
            {isLoading && !posts ? (
                <Loader />
            ) : posts?.pages.length === 1 ? (<div className='font-bold text-[19px]'>No saved posts</div>) : (
                <ul className='flex flex-col flex-1 gap-9 w-full'>
                   {posts?.pages.map((page, pageIndex) => (
                    <div key={`page-${pageIndex}`} className='flex flex-col gap-4'>
                      {page?.documents.map((post:any) => (
                       <PostCard
                       post={post.post}
                       key={post.$id}
               
                      />
                      ))}
                    </div>
                  ))}
                </ul>             
            )}
          </div>
          {hasNextPage &&  (
            <div ref={ref} className='mt-10'>
                <Loader />
            </div>
          )}  
        </div>
       
    </div>
  )
}

export default Saved