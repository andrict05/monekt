import { useState } from 'react';
import { BeatLoader } from 'react-spinners';

import { useGetRecentPosts, useSearchPosts } from '@/lib/react-query/queries';
import useDebounce from '@/hooks/useDebounce';
import FullPage from '@/ui/FullPage';
import Loader from '@/ui/Loader';
import { Post } from '@/ui/Post';

function Explore() {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 500);
  const { data: searchedPosts, isPending: isSearching } =
    useSearchPosts(debouncedSearch);
  const { data: recentPosts, isPending } = useGetRecentPosts();

  if (isSearching || isPending)
    return (
      <FullPage>
        <Loader />
      </FullPage>
    );

  const data =
    !isSearching && searchedPosts.length > 0 ? searchedPosts : recentPosts;

  return (
    <div className=' h-full overflow-y-auto'>
      <div className='mx-auto flex w-1/2 flex-col gap-2  rounded-md p-4 pt-8'>
        <label
          className='input input-bordered input-lg flex w-full items-center gap-2 '
          htmlFor='search-input'>
          <input
            type='text'
            id='search-input'
            className='grow text-slate-100'
            placeholder='Search'
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
          />
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 16 16'
            fill='currentColor'
            className='h-6 w-6 opacity-70'>
            <path
              fillRule='evenodd'
              d='M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z'
              clipRule='evenodd'
            />
          </svg>
        </label>
      </div>
      <div className=' hide-scrollbar h-[calc(100%-7rem)] overflow-y-scroll rounded-md pb-8 pt-4'>
        <div className='mx-auto w-1/2'>
          <h2 className='mb-4 text-xl font-bold'>Popular Today</h2>
          <Post.Container>
            {isSearching ? (
              <BeatLoader />
            ) : searchedPosts.length > 0 || debouncedSearch.length === 0 ? (
              data.map((post) => (
                <Post key={post.id} post={post}>
                  <Post.Header>
                    <Post.Avatar />
                    <Post.Group>
                      <Post.UserName />
                      <Post.Time />
                    </Post.Group>
                    <Post.Options className='ml-auto' />
                  </Post.Header>
                  <Post.Body>
                    <Post.Content />
                    <Post.Tags />
                    <Post.Image />
                  </Post.Body>
                  <Post.Footer className='mt-4 flex items-center justify-between'>
                    <Post.Like />
                    <Post.Save />
                  </Post.Footer>
                </Post>
              ))
            ) : (
              <p>No results</p>
            )}
          </Post.Container>
        </div>
      </div>
    </div>
  );
}

export default Explore;
