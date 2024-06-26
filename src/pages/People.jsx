import { useFollowUser, useGetAllUsers } from '@/lib/react-query/queries';
import { setFollows } from '@/userSlice';
import { createContext, useContext } from 'react';
import { HiMiniUser } from 'react-icons/hi2';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

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
    <div className='hide-scrollbar h-full overflow-y-scroll py-8'>
      <FollowContext.Provider value={{ follows, handleFollow, user }}>
        <div className='mx-auto w-2/3 px-24 sm:w-full '>
          <div className=' grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3'>
            {people.map(
              (profile) =>
                user.id !== profile.id && (
                  <ProfileCard key={profile.id} user={profile} />
                )
            )}
          </div>
        </div>
      </FollowContext.Provider>
    </div>
  );
}

function ProfileCard({ user }) {
  const {
    follows,
    handleFollow,
    user: loggedInUser,
  } = useContext(FollowContext);

  return (
    <div className='card card-bordered card-normal bg-base-100 shadow-md'>
      <figure className='px-8 pt-8'>
        <img
          src={user.avatar || '/assets/default-user.png'}
          alt={user.fullName}
          className='mask mask-squircle h-16 w-16 '
        />
      </figure>
      <div className='card-body items-center text-center [&_.card-title]:mb-0'>
        <Link to={`/profile/${user.id}`}>
          <h2 className='card-title text-slate-100 hover:underline'>
            {user.fullName}
          </h2>
        </Link>
        <p>@{user.username}</p>
        <div className='card-actions mt-2'>
          {user.id !== loggedInUser.id &&
            (follows.includes(user.id) ? (
              <button
                className='btn btn-primary'
                onClick={() => handleFollow(user.id)}>
                Unfollow
              </button>
            ) : (
              <button
                className='btn btn-accent'
                onClick={() => handleFollow(user.id)}>
                Follow
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}

export default People;
