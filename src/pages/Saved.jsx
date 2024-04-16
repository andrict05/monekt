import { useSavedPosts } from '@/lib/react-query/queries';
import { Post } from '@/ui/Post';
import Loader from '@/ui/Loader';
import FullPage from '@/ui/FullPage';

function Saved() {
  const { data, isPending } = useSavedPosts();

  if (isPending)
    return (
      <FullPage>
        <Loader />
      </FullPage>
    );
  if ((!isPending && data?.data?.length === 0) || !data?.data)
    return (
      <div className='py-8 text-center'>
        <h1 className='text-lg'>No saved posts.</h1>
      </div>
    );

  const savedPosts = data?.data || [];

  return (
    <div className='hide-scrollbar h-full overflow-y-scroll '>
      <div className=' mx-auto   w-full  flex-1 px-4 py-8 sm:w-2/3 xl:w-1/2'>
        <Post.Container>
          {savedPosts?.map((post) => (
            <Post post={post} key={post.id}>
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
                <div></div>
                <Post.Save />
              </Post.Footer>
            </Post>
          ))}
        </Post.Container>
      </div>
    </div>
  );
}

export default Saved;
