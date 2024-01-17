const postsContainer = document.querySelector("#posts");

const response = await fetch("api/v1/users/authenticated", {
  credentials: "include",
});
const data = await response.json();
const user = data?.data?.user;
if (!user) {
  window.location.href = "/login";
  throw new Error("Please login to get access to the homepage.");
}

const userData = document.querySelector(".user-data");
const imgEl = userData.querySelector("img");
const spanEl = userData.querySelector("span");
imgEl.src = "img/" + user.profilePicture;
spanEl.textContent = user.username;

const postResponse = await fetch("api/v1/posts");
const userPosts = (await postResponse.json()).data.posts;
console.log(userPosts);

const renderUserPosts = (data) => {
  postsContainer.innerHTML = "";
  data.forEach((post) => {
    const html = `
    <article class="post" data-post-id="${post._id}">
    <header class="article-header [ flex flex-ai-c ]">
    <img
    src="img/${post.author.profilePicture}"
    alt="User profile picture"
    class="post__profile-photo"
    />
    <span class="post__username">${post.author.username}</span>
    <span class="post__date">${post.datePosted}</span>
    </header>
    <div class="article-body">
    <p class="post__text">
    ${post.content}
    </p>
    </div>
    <footer class="article-footer">
    <button class="btn--post like-post">
    <svg
    class="btn__icon"
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    >
    <path
    fill="currentColor"
    d="m12.1 18.55l-.1.1l-.11-.1C7.14 14.24 4 11.39 4 8.5C4 6.5 5.5 5 7.5 5c1.54 0 3.04 1 3.57 2.36h1.86C13.46 6 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5c0 2.89-3.14 5.74-7.9 10.05M16.5 3c-1.74 0-3.41.81-4.5 2.08C10.91 3.81 9.24 3 7.5 3C4.42 3 2 5.41 2 8.5c0 3.77 3.4 6.86 8.55 11.53L12 21.35l1.45-1.32C18.6 15.36 22 12.27 22 8.5C22 5.41 19.58 3 16.5 3"
    />
    </svg>
    <span class="btn__text">Like</span>
    </button>
    <button class="btn--post comment-post">
    <svg
    class="btn__icon"
    xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        >
        <path
        fill="currentColor"
        d="M9 22a1 1 0 0 1-1-1v-3H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6.1l-3.7 3.71c-.2.19-.45.29-.7.29zm1-6v3.08L13.08 16H20V4H4v12z"
        />
        </svg>
        <span class="btn__text">Comment</span>
        </button>
        </footer>
        </article>
        `;
    postsContainer.insertAdjacentHTML("beforeend", html);
  });
};
try {
  renderUserPosts(userPosts);
} catch (error) {
  console.log(error);
}

document
  .querySelector(`a[href="/logout"]`)
  .addEventListener("click", async (e) => {
    e.preventDefault();
    const response = await fetch("api/v1/users/logout", {
      method: "POST",
      credentials: "include",
    });
    const data = await response.json();
    window.location.href = "/login";
    window.location.reload();
  });

document.querySelector("#create-post").addEventListener("click", async (e) => {
  e.preventDefault();
  const container = document.querySelector(".create-a-post");
  const text = container.querySelector("#create__text");
  if (!text.value) return;
  const response = await fetch("api/v1/posts", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content: text.value,
      author: user._id,
    }),
  });
  alert(await response.json());
});

postsContainer.addEventListener("click", (e) => {
  const post = e.target.closest(".post");
  if (!post) return;
  const postId = post.dataset.postId;
  const likeBtn = e.target.closest(".like-post");
});
