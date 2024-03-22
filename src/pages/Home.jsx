import { BeatLoader } from 'react-spinners';
import { usePosts } from '../features/post/usePosts';
import {
  HiEllipsisVertical,
  HiOutlinePencil,
  HiOutlineTrash,
} from 'react-icons/hi2';
import MenuProvider from '../components/Menu';
import { useAuthenticatedUser } from '../features/auth/useAuthenticatedUser';
import { useDeletePost } from '../features/post/useDeletePost';

function Home() {
  const { data, isPostsPending, error } = usePosts();

  if (isPostsPending) return <BeatLoader color='#f0f0ff' size={20} />;

  return (
    <div className='w-full'>
      <MenuProvider>
        {/* {data?.map((post) => (
          <Post key={post.id} post={post} />
        ))} */}
      </MenuProvider>
    </div>
  );
}

function Post({ post }) {
  const { user } = useAuthenticatedUser();
  const { deletePost, isDeleting } = useDeletePost();

  function handleDelete(e) {
    e.preventDefault();
    const postId = post.id;
    deletePost(postId);
  }

  return (
    <div key={post.id} className='relative mb-6 rounded-md bg-slate-800 p-4'>
      <header className='mb-2 flex items-center justify-between '>
        <div>
          <img
            src={post.author.avatar || './assets/logo.png'}
            alt={post.author.fullName}
            className='mr-3 inline-block h-12 rounded-full'
          />
          <span className='mr-1 text-lg font-semibold text-slate-300'>
            {post.author.fullName}
          </span>
          <span className='text-md font-light text-slate-300'>
            @{post.author.username}
          </span>
        </div>
        <div>
          <MenuProvider.Menu>
            <MenuProvider.Toggle id={post.id}>
              <HiEllipsisVertical size={22} />
            </MenuProvider.Toggle>
            <MenuProvider.OptionList id={post.id}>
              <button className='flex w-full items-center gap-1 rounded-md px-2 py-1 hover:bg-slate-500'>
                <span>Menu</span>
              </button>
              {user.id === post.author.id && (
                <button
                  className='flex w-full items-center gap-1 rounded-md px-2 py-1 text-red-500 hover:bg-slate-500'
                  onClick={handleDelete}>
                  <HiOutlineTrash />
                  <span>Delete post</span>
                </button>
              )}
            </MenuProvider.OptionList>
          </MenuProvider.Menu>
        </div>
      </header>

      <h1 className='mb-2 text-2xl'>{post.title}</h1>
      <p>{post.body}</p>
      {post.image && (
        <img
          className='mt-2 h-96'
          src={post.image}
          alt={post.title + ' image'}
        />
      )}
    </div>
  );
}

export default Home;
