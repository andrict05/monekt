import { useFollowedPosts, useGetRecentPosts } from '@/lib/react-query/queries';
import { Post } from '@/ui/Post';
import Loader from '@/ui/Loader';
import FullPage from '@/ui/FullPage';

function Home() {
  const { data: recentPosts, isPending } = useGetRecentPosts();
  const { data: followersPosts, isPending: isFollowedPostsPending } =
    useFollowedPosts();

  if (isPending || isFollowedPostsPending)
    return (
      <FullPage>
        <Loader />
      </FullPage>
    );

  let data = followersPosts ? followersPosts : recentPosts ? recentPosts : [];

  return (
    <div className='hide-scrollbar h-full overflow-y-scroll '>
      <div className=' mx-auto  w-1/2 flex-1  py-8'>
        {data.length > 0 ? (
          <Post.Container>
            {data.map((post) => (
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
          <p className='text-lg text-slate-100'>
            There is nothing new. Follow some people to get latest news.
          </p>
        )}
      </div>
    </div>
  );
}

export default Home;
