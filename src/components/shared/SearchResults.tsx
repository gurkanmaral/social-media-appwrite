import { Models } from 'appwrite';
import React from 'react'
import Loader from './Loader';
import GridPostList from './GridPostList';
import PostCard from './PostCard';


type SearchResultsProps = {
  isSearchFetching:boolean;
  searchedPost: Models.Document[];
}

const SearchResults = ({isSearchFetching,searchedPost}:SearchResultsProps) => {

 

  if(isSearchFetching) return <Loader />

  if(searchedPost && searchedPost?.documents?.length > 0)  {

    return (
      <div className='flex items-center justify-center'>
        {searchedPost?.documents?.map((post)=>(
          <PostCard post={post} key={post.$id} />
        ))}
      </div>
    )
  }
console.log(searchedPost?.documents)
  return (
   <p className='text-light-4 mt-10 text-center w-full'>
    No results found
   </p>
  )
}

export default SearchResults