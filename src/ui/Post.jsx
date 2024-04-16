import { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  HiBookmark,
  HiHeart,
  HiMiniUser,
  HiOutlineBookmark,
  HiOutlineHeart,
  HiOutlineTrash,
  HiUser,
  HiUserCircle,
  HiUserMinus,
  HiUserPlus,
} from 'react-icons/hi2';
import { formatDistanceToNow } from 'date-fns';
import {
  useFollowUser,
  useSavePost,
  useUpdateLikes,
  useUpdateSavedPost,
} from '@/lib/react-query/queries';

import { useCurrentUser, useDeletePost } from '@/lib/react-query/queries';
import { Menu, MenuItem, MenuList, MenuToggle } from '@/components/Menu';
import { setFollows, setSavedPosts } from '@/userSlice';

const PostContext = createContext();

function usePostContext() {
  const context = useContext(PostContext);

  if (!context) {
    throw new Error('usePostContext must be used within a PostContext');
  }

  return context;
}

export function Post({ post, children, ...props }) {
  const [isSaved, setIsSaved] = useState(false);
  const { followUser } = useFollowUser();

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.currentUser);

  const follows = useSelector((state) => state.user.follows);

  function handleFollow(authorId) {
    const followedByCurrentUser = follows?.includes(authorId);
    let newFollows = follows;

    if (authorId === user.id) return;

    if (followedByCurrentUser) {
      newFollows = newFollows.filter((id) => id !== authorId);
    } else {
      newFollows = [...newFollows, authorId];
    }
    dispatch(setFollows(newFollows));

    followUser({ userId: user.id, followingArray: newFollows });
  }

  const { savePost } = useSavePost();
  const { updateSavedPost } = useUpdateSavedPost();
  const { currentUser } = useCurrentUser();
  const { deletePost } = useDeletePost();
  const { updateLikes } = useUpdateLikes(post.id);

  const [likes, setLikes] = useState(post.likes || []);

  const bookmarked = user.savedPosts?.includes(post.id);

  useEffect(() => {
    setIsSaved(bookmarked);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const value = {
    handleLike,
    handleRemoveBookmark,
    handleSave,
    handleDelete,
    handleFollow,
    follows,
    likes,
    post,
    user,
    isSaved,
  };

  return (
    <PostContext.Provider value={value}>
      <article
        className='relative rounded-lg border border-base-200 bg-base-100 p-6 shadow-md [&:not(:last-child)]:mb-10'
        {...props}>
        {children}
      </article>
    </PostContext.Provider>
  );
}

Post.Container = function Container({ children }) {
  return <Menu>{children}</Menu>;
};

Post.Header = function Header({ children, ...props }) {
  return (
    <header className='mb-4 flex items-center' {...props}>
      {children}
    </header>
  );
};

Post.Avatar = function Avatar() {
  const { post } = usePostContext();

  return (
    <img
      src={post.author.avatar || '/assets/default-user.png'}
      alt={post.author.fullName}
      className='mask mask-squircle mr-4 h-16 w-16'
    />
  );
};
Post.Group = function Group({ children, ...props }) {
  return <div {...props}>{children}</div>;
};

Post.UserName = function UserName() {
  const {
    post: {
      author: { fullName, id },
    },
  } = usePostContext();

  return (
    <Link to={`/profile/${id}`}>
      <p className='text-lg font-semibold text-slate-200 hover:cursor-pointer hover:underline hover:underline-offset-1'>
        {fullName}
      </p>
    </Link>
  );
};

Post.Time = function Time() {
  const { post } = usePostContext();

  const timePassed = formatDistanceToNow(post.created_at, { addSuffix: true });

  return <p>{timePassed}</p>;
};

Post.Options = function Options({ ...props }) {
  const { post, follows, handleFollow, handleDelete, user } = usePostContext();

  return (
    <div {...props}>
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
            {follows.includes(post.author.id) ? (
              <MenuItem onClick={() => handleFollow(post.author.id)}>
                <HiUserMinus />
                <span>Unfollow</span>
              </MenuItem>
            ) : (
              <MenuItem onClick={() => handleFollow(post.author.id)}>
                <HiUserPlus />
                <span>Follow</span>
              </MenuItem>
            )}
          </>
        )}
        {post.author?.id === user?.id && (
          <MenuItem onClick={handleDelete} className='text-red-500'>
            <HiOutlineTrash />
            <span>Delete</span>
          </MenuItem>
        )}
      </MenuList>
    </div>
  );
};

Post.Body = function Body({ children, ...props }) {
  return <div {...props}>{children}</div>;
};

Post.Content = function Content() {
  const {
    post: { body },
  } = usePostContext();

  return <p className='p-2 text-lg text-slate-50'>{body}</p>;
};

Post.Tags = function Tags() {
  const {
    post: { tags: tagsString },
  } = usePostContext();

  const tags = tagsString
    .split(',')
    .map((tag) => `#${tag.trim()}`)
    .join(' ');

  return tags.length > 1 ? (
    <p className='text-md p-1 text-slate-400'>{tags}</p>
  ) : null;
};

Post.Image = function Image() {
  const { post } = usePostContext();

  return post.image && <img className='mt-2 w-full' src={post.image} />;
};

Post.Footer = function Footer({ children, ...props }) {
  return <footer {...props}>{children}</footer>;
};

Post.Like = function Like() {
  const { handleLike, likes, user } = usePostContext();

  return (
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
  );
};

Post.Save = function Save() {
  const { post, handleSave, handleRemoveBookmark, user, isSaved } =
    usePostContext();

  return (
    post.author.id !== user.id &&
    (isSaved ? (
      <button onClick={handleRemoveBookmark}>
        <HiBookmark />
      </button>
    ) : (
      <button onClick={handleSave}>
        <HiOutlineBookmark />
      </button>
    ))
  );
};
