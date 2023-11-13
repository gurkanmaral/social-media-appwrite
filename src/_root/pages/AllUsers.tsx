import UsersList from '@/components/shared/UsersList';
import { Input } from '@/components/ui/input'
import useDebounce from '@/hooks/useDebounce';
import {  useGetUsers, useSearchUsers } from '@/lib/react-query/queriesAndMutations';
import { Models } from 'appwrite';
import { Loader } from 'lucide-react';
import  { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer';


export type SearchResultProps = {
  isSearchFetching: boolean;
  searchedUser?: Models.Document[];
};
const SearchUserResults = ({ isSearchFetching, searchedUser }: SearchResultProps) =>{

  if (isSearchFetching) {
    return <Loader />;
  } else if (searchedUser && searchedUser.length > 0) {
    return <UsersList users={searchedUser} />;
  } else {
    return (
      <p className="text-light-4 mt-10 text-center w-full">No results found</p>
    );
  }
}

const AllUsers = () => {

  const [searchValue,setSearchValue] = useState('')


 
  const {ref,inView} = useInView();

  const {data:users,fetchNextPage,hasNextPage} = useGetUsers();

  const debouncedValue = useDebounce(searchValue,500);

  const {data:searchedUser,isFetching:isSearchFetching} = useSearchUsers(debouncedValue)

  useEffect(()=>{
    if(inView && !searchValue) fetchNextPage();
  },[inView,searchValue])


  if(!users){
    return (
      <div className='flex-center w-full h-full'>
          <Loader />
      </div>
    )
   }


  
   
   const shouldShowSearchResults = searchValue !== '';
   const shouldShowPosts = !shouldShowSearchResults && users.pages.every((item)=> item?.documents.length === 0)
  
   return (
    <div className='flex flex-col flex-1 items-center gap-10 overflow-scroll py-10 px-5 md:px-8 lg:p-14 custom-scrollbar'>
      <div className='max-w-5xl flex flex-col items-center w-full gap-6 md:gap-9'>
        <h2 className=' h3-bold md:h2-bold text-left w-full'>
            AllUsers
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
     
      <div className='flex flex-wrap gap-9 w-full max-w-5xl'>
      {shouldShowSearchResults ? (
            <SearchUserResults
            isSearchFetching = {isSearchFetching}
            searchedUser={searchedUser?.documents}
            />
          ) : shouldShowPosts ? (
            <p className='text-light-4 mt-10 text-center w-full'>
              End of posts</p>
          ): (
            users.pages.map((item,index)=>(
              <UsersList key={`page-${index}`}
              users={item?.documents}
              />
            ))
          )}
      </div>
      {hasNextPage && !searchValue && (
            <div ref={ref} className='mt-10'>
                <Loader />
            </div>
          )}
    </div>
  )
}

export default AllUsers