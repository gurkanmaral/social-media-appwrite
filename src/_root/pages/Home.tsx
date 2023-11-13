import HomePostList from '@/components/shared/HomePostList';
import Loader from '@/components/shared/Loader';
import Rightbar from '@/components/shared/Rightbar';
import { useGetPosts } from '@/lib/react-query/queriesAndMutations';
import {useEffect} from 'react'
import { useInView } from 'react-intersection-observer';

const Home = () => {
  const {ref,inView} = useInView();
  const {data:posts,fetchNextPage,hasNextPage,isPending:isLoading} = useGetPosts()

  useEffect(()=>{
    if(inView ) fetchNextPage();
  },[inView])



  return (
    <div className='flex flex-1'>
      <div className='home-container'>
        <div className='home-posts'>
            <h2 className='h3-bold md:h2-bold text-left w-full'>
              Home

            </h2>
            {isLoading && !posts ? (
                <Loader />
            ): (
                <ul className='flex flex-col flex-1 gap-9 w-full'>
                    {posts?.pages.map((post,index)=>(
                       <HomePostList key={`page-${index}`}
                       posts={post?.documents}
                       />
                       
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
      <Rightbar />
    </div>

  )
}

export default Home