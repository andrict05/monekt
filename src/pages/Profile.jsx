import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { format, getYear } from 'date-fns';

import { useGetProfile, useUserPosts } from '@/lib/react-query/queries';
import Loader from '@/ui/Loader';
import supabase from '@/services/supabase';
import { Post } from '@/ui/Post';
import FullPage from '@/ui/FullPage';
import {
  HiCalendarDays,
  HiDocumentText,
  HiMiniUser,
  HiNoSymbol,
  HiUserPlus,
} from 'react-icons/hi2';

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

  const avatar = profile.avatar;

  return (
    <div className='mx-auto flex w-full flex-col items-center gap-8 py-8 pl-4 md:flex-row md:items-start 2xl:w-7/12'>
      <div className='flex  min-w-64 max-w-80 shrink-0 flex-col items-center rounded-lg bg-base-100 p-6 shadow-md'>
        <div className='mask mask-squircle mb-4 inline-block rounded-lg bg-neutral p-4'>
          {avatar ? (
            <img
              src={avatar}
              alt={user.fullName}
              className='mask mask-squircle h-32 w-32 object-cover'
            />
          ) : (
            <HiMiniUser className='mask mask-squircle h-32 w-32 bg-neutral' />
          )}
        </div>
        <h1 className='mb-1 text-2xl font-semibold text-slate-50'>
          {profile.fullName}
        </h1>
        <h2 className='mb-6 text-lg text-slate-200'>@{profile.username}</h2>

        <div className='stats stats-vertical text-xs shadow md:text-sm'>
          <div className='stat'>
            <div className='stat-figure text-primary'>
              <HiCalendarDays className='inline-block h-8 w-8 stroke-current' />
            </div>
            <div className='stat-title'>Joined in</div>
            <div className='stat-value'>
              {format(profile.created_at, 'MMM yyyy')}
            </div>
          </div>

          <div className='stat'>
            <div className='stat-figure text-primary'>
              <HiUserPlus className='inline-block h-8 w-8 stroke-current' />
            </div>
            <div className='stat-title'>Following</div>
            <div className='stat-value'>{profile?.following?.length || 0}</div>
          </div>

          <div className='stat'>
            <div className='stat-figure text-primary'>
              <HiDocumentText className='inline-block h-8 w-8 stroke-current' />
            </div>
            <div className='stat-title'>Posts</div>
            <div className='stat-value'>{numPosts}</div>
          </div>
        </div>
      </div>
      <div className='mx-4 w-full grow pr-4'>
        {!postsError && posts.length > 0 ? (
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
          <h1 className='flex items-center gap-2 rounded-lg  bg-base-100 p-10 text-lg text-red-300'>
            <HiNoSymbol className='inline-block h-6 w-6 stroke-current' />
            User hasn&apos;t posted yet.
          </h1>
        )}
      </div>
    </div>
  );
}
export default Profile;
