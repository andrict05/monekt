import { useFollowUser, useGetAllUsers } from '@/lib/react-query/queries';
import { setFollows } from '@/userSlice';
import { createContext, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const FollowContext = createContext();

function People() {
  const { data: people = [], isPending, error } = useGetAllUsers();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.currentUser);
  const follows = useSelector((state) => state.user.follows);
  const { followUser } = useFollowUser();

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

  return (
    <FollowContext.Provider value={{ follows, handleFollow, user }}>
      <div className='w-full '>
        <h1 className='text-2xl font-bold'>All users</h1>
        <div className='mt-4 grid grid-cols-3 gap-8'>
          {people.map((user) => (
            <ProfileCard key={user.id} user={user} />
          ))}
        </div>
      </div>
    </FollowContext.Provider>
  );
}

function ProfileCard({ user }) {
  const {
    follows,
    handleFollow,
    user: loggedInUser,
  } = useContext(FollowContext);

  return (
    <div className='flex flex-col items-center rounded-md border border-slate-800 p-10'>
      <img
        src={user.avatar || '/assets/logo.png'}
        alt={user.fullName}
        className='mb-5 inline-block h-16 w-16 rounded-full'
      />
      <h2 className='mb-2 text-xl font-bold'>{user.fullName}</h2>
      <p className='mb-5'>@{user.username}</p>
      {user.id !== loggedInUser.id &&
        (follows.includes(user.id) ? (
          <button
            className='rounded-md bg-blue-900 px-3 py-2 font-bold text-blue-200'
            onClick={() => handleFollow(user.id)}>
            Unfollow
          </button>
        ) : (
          <button
            className='rounded-md bg-blue-600 px-3 py-2 font-bold'
            onClick={() => handleFollow(user.id)}>
            Follow
          </button>
        ))}
    </div>
  );
}

export default People;
