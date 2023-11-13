
import Loader from '@/components/shared/Loader';
import ProfilePostsCard from '@/components/shared/ProfilePostsCard';
import SearchResults from '@/components/shared/SearchResults';
import { Input } from '@/components/ui/input'
import useDebounce from '@/hooks/useDebounce';
import { useGetPosts, useSearchPosts } from '@/lib/react-query/queriesAndMutations';
import {useState,useEffect} from 'react'
import { useInView } from 'react-intersection-observer';

const Explore = () => {

  const {ref,inView} = useInView();


  const {data:posts,fetchNextPage,hasNextPage} = useGetPosts()
  
  const [searchValue, setSearchValue] = useState("")
  
  const debouncedValue = useDebounce(searchValue,500);
  const {data:searchedPost,isFetching:isSearchFetching} = useSearchPosts(debouncedValue)

  useEffect(()=>{
    if(inView && !searchValue) fetchNextPage();
  },[inView,searchValue])

 
 if(!posts){
  return (
    <div className='flex-center w-full h-full'>
        <Loader />
    </div>
  )
 }
 const shouldShowSearchResults = searchValue !== '';
 const shouldShowPosts = !shouldShowSearchResults && posts.pages.every((item)=> item?.documents.length === 0)


  return (
    <div className='flex flex-col flex-1 items-center overflow-scroll py-10 px-5 md:p-14 custom-scrollbar'>
      <div className='explore-inner_container'>
          <h2 className='h3-bold md:h2-bold w-full'>
              Search Posts
          </h2>
          <div className='flex gap-1 px-4 w-full rounded-lg bg-dark-4'>
              <img src="/assets/icons/search.svg"
              width={24}
              height={24}
              alt="search" />
              <Input 
              type='text'
              placeholder='Search'
              className='explore-search'
              value={searchValue}
              onChange={(e)=>setSearchValue(e.target.value)}
              />
          </div>
      </div>
      <div className='flex w-full max-w-5xl mt-16 mb-7'>
          <h3 className='body-bold md:h3-bold'>
            Popular Posts
          </h3>
      </div>
      <div className=' gap-9 w-full max-w-5xl'>
          {shouldShowSearchResults ? (
            <SearchResults
            isSearchFetching = {isSearchFetching}
            searchedPost={searchedPost?.documents}
            />
          ) : shouldShowPosts ? (
            <p className='text-light-4 mt-10 text-center w-full'>
              End of posts</p>
          ): (
            posts.pages.map((page,pageIndex)=>(
              <div key={`page-${pageIndex}`} className='flex flex-col gap-4'>
              {page?.documents.map((post:any) => (
               <ProfilePostsCard
               post={post}
               key={post.$id}      
              />
              ))}
            </div>          
            )))}
          </div>
          {hasNextPage && !searchValue && (
            <div ref={ref} className='mt-10'>
                <Loader />
            </div>
          )}
    </div>
  )
}

export default Explore