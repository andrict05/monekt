import catchAsyncError from "../utils/catchAsyncError.js";
import AppError from "../utils/appError.js";
import Post from "../models/postModel.js";

export const getAllPosts = catchAsyncError(async (request, response, next) => {
  const page = +request.query.page || 1;
  const limit = +request.query.limit || 10;
  const sort = request.query.sort || "datePosted";
  const skip = (page - 1) * limit;
  let query = Post.find().skip(skip).limit(limit);
  query = query.populate({
    path: "author",
    select: "_id username profilePicture",
  });
  const posts = await query.sort(sort);
  response.status(200).json({
    status: "success",
    results: posts.length,
    data: {
      posts,
    },
  });
});

export const createPost = catchAsyncError(async (request, response, next) => {
  const newPost = await Post.create(request.body);

  response.status(201).json({
    status: "success",
    data: {
      post: newPost,
    },
  });
});

export const getPostById = catchAsyncError(async (request, response, next) => {
  const post = await Post.findById(request.params.id);

  if (!post) {
    return next(new AppError("No post found with that ID.", 404));
  }

  response.status(200).json({
    status: "success",
    data: {
      post,
    },
  });
});

export const getMyPosts = catchAsyncError(async (request, response, next) => {
  const posts = await Post.find({ author: request.user._id });

  response.status(200).json({
    status: "success",
    results: posts.length,
    data: {
      posts,
    },
  });
});

export const deletePost = catchAsyncError(async (request, response, next) => {
  const post = await Post.findByIdAndDelete(request.params.id);

  if (!post) {
    return next(new AppError("No post found with that ID.", 404));
  }

  response.status(204).json({
    status: "success",
    data: null,
  });
});
