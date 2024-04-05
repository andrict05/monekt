import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getYear } from 'date-fns';

import { useGetProfile, useUserPosts } from '@/lib/react-query/queries';
import Loader from '@/ui/Loader';
import supabase from '@/services/supabase';
import { Post } from '@/ui/Post';
import FullPage from '@/ui/FullPage';

function Profile() {
  const { id } = useParams();
  const user = useSelector((state) => state.user.currentUser);
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
  }, [id, posts, user]);

  if (isPending || isPostsPending)
    return (
      <FullPage>
        <Loader />
      </FullPage>
    );
  if ((!isPending && !profile) || profileError)
    return <h1>Profile not found</h1>;

  return (
    <div className='mx-auto flex w-1/2 items-start py-8'>
      <div className='flex shrink-0 grow flex-col items-center rounded-lg bg-base-100 p-10'>
        <img
          src={profile.avatar || '/assets/logo.png'}
          alt={profile.fullName}
          className=' mask mask-squircle mb-4 h-32 w-auto'
        />
        <h1 className='mb-1 text-2xl text-slate-50'>{profile.fullName}</h1>
        <h2 className='mb-6 text-lg text-slate-200'>@{profile.username}</h2>
        <p className='text-slate-300'>
          Joined in {getYear(profile.created_at)}
        </p>
        <div className='mt-6 flex items-center'>
          <span className='text-md text-slate-300'>
            {profile?.following?.length || 0} followings
          </span>
        </div>
        <div className='mt-6 flex items-center'>
          <span className='text-md text-slate-300'>{numPosts} posts</span>
        </div>
      </div>
      <div className='mx-4 grow'>
        {!postsError ? (
          <Post.Container>
            {posts.map((post) => (
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
            ))}
          </Post.Container>
        ) : (
          <h1 className='p-10 text-xl text-slate-100'>
            User hasn&apos;t posted yet.
          </h1>
        )}
      </div>
    </div>
  );
}
export default Profile;
