import Loader from '../ui/Loader';
import { Menu, MenuItem, MenuList, MenuToggle } from '../components/Menu';
import {
  useCurrentUser,
  useDeletePost,
  useSavePost,
  useSavedPosts,
  useUpdateLikes,
  useUpdateSavedPost,
} from '@/lib/react-query/queries';
import {
  HiBookmark,
  HiHeart,
  HiOutlineBookmark,
  HiOutlineHeart,
  HiOutlineTrash,
  HiUser,
  HiUserPlus,
} from 'react-icons/hi2';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { setSavedPosts } from '@/userSlice';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

function Saved() {
  const { data, isPending } = useSavedPosts();

  if (isPending) return <Loader />;
  if (!isPending && !data) return <h1>No saved posts</h1>;

  const savedPosts = data.data;

  return (
    <div className='flex w-full flex-col '>
      <h1 className='mb-6 text-2xl font-bold'>Saved Posts</h1>
      <Menu>
        {savedPosts?.map((post) => (
          <Post post={post} key={post.id} />
        ))}
      </Menu>
    </div>
  );
}

function Post({ post }) {
  const [isSaved, setIsSaved] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.currentUser);

  const { savePost } = useSavePost();
  const { updateSavedPost } = useUpdateSavedPost();
  const { currentUser } = useCurrentUser();
  const { deletePost } = useDeletePost();
  const { updateLikes } = useUpdateLikes(post.id);
  const [likes, setLikes] = useState(post.likes || []);

  const bookmarked = user?.savedPosts?.includes(post.id);

  useEffect(() => {
    setIsSaved(bookmarked);
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
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
    updateSavedPost(
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
    <div
      key={post.id}
      className='relative mb-6 w-4/5 rounded-md bg-slate-800 p-4'>
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

export default Saved;
