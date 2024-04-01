import { Menu, MenuItem, MenuList, MenuToggle } from '@/components/Menu';
import useDebounce from '@/hooks/useDebounce';
import {
  useCurrentUser,
  useDeletePost,
  useGetRecentPosts,
  useSavePost,
  useSearchPosts,
  useUpdateLikes,
  useUpdatePost,
} from '@/lib/react-query/queries';
import { setSavedPosts } from '@/userSlice';
import { formatDistanceToNow } from 'date-fns';
import { useEffect, useState } from 'react';
import {
  HiBookmark,
  HiHeart,
  HiMagnifyingGlass,
  HiOutlineBookmark,
  HiOutlineHeart,
  HiOutlineTrash,
  HiUser,
  HiUserPlus,
} from 'react-icons/hi2';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { BeatLoader } from 'react-spinners';

function Explore() {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 500);
  const { data: searchedPosts, isPending: isSearching } =
    useSearchPosts(debouncedSearch);
  const { data: recentPosts } = useGetRecentPosts();

  return (
    <div className='w-full space-y-10'>
      <h1 className='text-2xl font-bold'>Explore</h1>
      <div className='flex items-center gap-2 rounded-md bg-slate-800 p-4 text-slate-50'>
        <label htmlFor='search'>
          <HiMagnifyingGlass
            size={20}
            className='text-slate-400 '
            strokeWidth={1}
          />
        </label>
        <input
          type='text'
          name='search'
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
          }}
          id='search'
          className=' w-full rounded-md bg-slate-800 px-2 text-slate-50 outline-none'
          placeholder='Search'
        />
      </div>
      <div className=''>
        <h2 className='mb-4 text-xl font-bold'>Popular Today</h2>
        <div>
          <Menu>
            {isSearching ? (
              <BeatLoader />
            ) : searchedPosts.length > 0 ? (
              searchedPosts?.map((post) => <Post key={post.id} post={post} />)
            ) : debouncedSearch.length > 0 ? (
              <p>No results found.</p>
            ) : (
              recentPosts?.map((post) => <Post key={post.id} post={post} />)
            )}
          </Menu>
        </div>
      </div>
    </div>
  );
}

function Post({ post }) {
  const [isSaved, setIsSaved] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.currentUser);

  const { savePost } = useSavePost();
  const { updatePost } = useUpdatePost();
  const { currentUser } = useCurrentUser();
  const { deletePost } = useDeletePost();
  const { updateLikes } = useUpdateLikes(post.id);
  const [likes, setLikes] = useState(post.likes || []);

  const bookmarked = user?.savedPosts?.includes(post.id);

  useEffect(() => {
    setIsSaved(bookmarked);
  }, [currentUser]);

  function handleDelete(e) {
    e.preventDefault();
    deletePost(post);
  }

  function handleSave() {
    const userPosts = user.savedPosts || [];
    const newPosts = [...userPosts, post.id];
    setIsSaved(true);
    savePost(
      { posts: newPosts },
      {
        onSuccess: (data) => {
          dispatch(setSavedPosts(data));
        },
      }
    );
  }
  function handleRemoveBookmark() {
    const postId = post.id;
    const updatedPosts = user.savedPosts.filter((id) => id !== postId) || [];
    setIsSaved(false);
    updatePost(
      { posts: updatedPosts },
      {
        onSuccess: (data) => {
          dispatch(setSavedPosts(data));
        },
      }
    );
  }

  function handleLike() {
    const likedByCurrentUser = likes.includes(user.id);
    let newLikes = likes;

    if (likedByCurrentUser) {
      newLikes = newLikes.filter((id) => id !== user.id);
      setLikes(newLikes);
    } else {
      newLikes = [...newLikes, user.id];
      setLikes(newLikes);
    }

    updateLikes({ postId: post.id, likesArray: newLikes });
  }

  const tagsArr = post.tags.split(',').map((tag) => tag.trim());
  const tagString = tagsArr.map((tag) => `#${tag}`).join(' ');
  const timePassed = formatDistanceToNow(post.created_at, { addSuffix: true });

  return (
    <div key={post.id} className='relative mb-6 rounded-md bg-slate-800 p-4'>
      <header className='mb-2 flex items-center justify-between '>
        <div className='flex items-center'>
          <img
            src={post.author.avatar || './assets/logo.png'}
            alt={post.author.fullName}
            className='mr-3 inline-block h-12 rounded-full'
          />
          <Link to={`/profile/${post.author.id}`}>
            <div className='flex flex-col'>
              <span className='mr-1 text-lg font-semibold text-slate-100 hover:underline'>
                {post.author.fullName}
              </span>
            </div>
            <span className='text-slate-300'>{timePassed}</span>
          </Link>
        </div>
        <MenuToggle toggles={post.id} />
        <MenuList list={post.id}>
          {post.author?.id !== user?.id && (
            <>
              <MenuItem>
                <Link
                  to={`/profile/${post.author.id}`}
                  className='flex items-center gap-2'>
                  <HiUser />
                  <span>Show profile</span>
                </Link>
              </MenuItem>
              <MenuItem>
                <HiUserPlus />
                <span>Follow</span>
              </MenuItem>
            </>
          )}
          {post.author?.id === user?.id && (
            <MenuItem onClick={handleDelete} className='text-red-500'>
              <HiOutlineTrash />
              <span>Delete</span>
            </MenuItem>
          )}
        </MenuList>
      </header>
      <p>{post.body}</p>
      {post.tags.length > 0 && (
        <span className='mt-2 block text-slate-400'>{tagString}</span>
      )}
      {post.image && (
        <img className='max-w-fullk mt-2 h-auto ' src={post.image} />
      )}
      <div className='mt-2 flex justify-between '>
        <button
          className='flex items-center gap-1 text-slate-400'
          onClick={handleLike}>
          {likes.includes(user.id) ? (
            <HiHeart size={24} className='text-red-500' />
          ) : (
            <HiOutlineHeart size={24} />
          )}
          <span>{likes.length}</span>
        </button>
        {post.author.id !== user.id &&
          (isSaved ? (
            <button onClick={handleRemoveBookmark}>
              <HiBookmark />
            </button>
          ) : (
            <button onClick={handleSave}>
              <HiOutlineBookmark />
            </button>
          ))}
      </div>
    </div>
  );
}

export default Explore;
