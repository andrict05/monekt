import { Link, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { formatDistanceToNow, getYear } from 'date-fns';
import { HiOutlinePencil, HiOutlineTrash, HiUserPlus } from 'react-icons/hi2';

import {
  useDeletePost,
  useGetProfile,
  useUserPosts,
} from '@/lib/react-query/queries';
import { Menu, MenuItem, MenuList, MenuToggle } from '@/components/Menu';
import Loader from '@/ui/Loader';
import { useEffect, useState } from 'react';
import supabase from '@/services/supabase';

function Profile() {
  const { id } = useParams();
  const [numPosts, setNumPosts] = useState(0);
  const { profile, isPending, error: profileError } = useGetProfile(id);
  let { data: posts, isPostsPending, error: postsError } = useUserPosts(id);

  useEffect(() => {
    async function getNumberOfPosts() {
      const { data } = await supabase
        .from('posts')
        .select('id')
        .eq('author_id', id);
      const numberOfPosts = data.length;
      setNumPosts(numberOfPosts || 0);
    }
    getNumberOfPosts();
  }, [id, posts]);

  if (isPending || isPostsPending)
    return (
      <div className='flex w-full justify-center'>
        <Loader />
      </div>
    );
  if ((!isPending && !profile) || profileError)
    return <h1>Profile not found</h1>;

  return (
    <Menu>
      <div className='flex w-full items-start'>
        <div className='flex  w-1/5 flex-col items-center rounded-md bg-slate-900 p-10'>
          <img
            src={profile.avatar || '/assets/logo.png'}
            alt={profile.fullName}
            className=' mb-4 h-32 w-32 rounded-full  border-4 border-slate-700  '
          />
          <h1 className='mb-1 text-2xl text-slate-50'>{profile.fullName}</h1>
          <h2 className='mb-6 text-lg text-slate-200'>@{profile.username}</h2>
          <p className='text-slate-300'>
            Joined in {getYear(profile.created_at)}
          </p>
          <div className='mt-6 flex items-center'>
            <span className='text-md text-slate-300'>
              {profile.following.length} followings
            </span>
          </div>
          <div className='mt-6 flex items-center'>
            <span className='text-md text-slate-300'>{numPosts} posts</span>
          </div>
        </div>
        <div className='mx-4 w-1/2 '>
          {!postsError ? (
            posts?.map((post) => <Post key={post.id} post={post} />)
          ) : (
            <h1 className='p-10 text-xl text-slate-100'>
              User hasn&apos;t posted yet.
            </h1>
          )}
        </div>
      </div>
    </Menu>
  );
}

function Post({ post }) {
  const user = useSelector((state) => state.user.currentUser);
  const navigate = useNavigate();
  const { deletePost } = useDeletePost();

  function handleDelete(e) {
    e.preventDefault();
    deletePost(post);
  }

  function handleEdit() {
    navigate(`/update-post/${post.id}`);
  }

  const tagsArr = post.tags.split(',').map((tag) => tag.trim());
  const tagString = tagsArr.map((tag) => `#${tag}`).join(' ');
  const timePassed = formatDistanceToNow(post.created_at, { addSuffix: true });

  return (
    <div key={post.id} className='relative mb-6 rounded-md bg-slate-800 p-4'>
      <header className='mb-2 flex items-center justify-between '>
        <div className='flex items-center'>
          <img
            src={post.author.avatar || '/assets/logo.png'}
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
          {post.author.id !== user.id && (
            <>
              <MenuItem>
                <HiUserPlus />
                <span>Follow</span>
              </MenuItem>
            </>
          )}
          {post.author.id === user.id && (
            <>
              <MenuItem onClick={handleEdit} className=''>
                <HiOutlinePencil />
                <span>Edit</span>
              </MenuItem>
              <MenuItem onClick={handleDelete} className='text-red-500'>
                <HiOutlineTrash />
                <span>Delete</span>
              </MenuItem>
            </>
          )}
        </MenuList>
      </header>
      <p>{post.body}</p>
      {post.tags.length > 0 && (
        <span className='mt-2 block text-slate-400'>{tagString}</span>
      )}
      {post.image && (
        <img className='mt-2 h-auto max-w-full' src={post.image} />
      )}
    </div>
  );
}

export default Profile;
