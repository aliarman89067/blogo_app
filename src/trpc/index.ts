import * as z from "zod";
import { router, publicProcedure } from "./trpc";
import db from "../../db/prismaClient";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";

export const appRouter = router({
  createUser: publicProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string(),
        password: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { name, email, password } = input;
      const existingUser = await db.user.findFirst({
        where: {
          email,
        },
      });
      if (existingUser && existingUser.email) {
        throw new TRPCError({
          message: "This email already exist",
          code: "CONFLICT",
        });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const userDoc = await db.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          isOAuth: false,
        },
      });
      const token = jwt.sign(
        {
          userId: userDoc.id,
          userName: userDoc.name,
          userEmail: userDoc.email,
        },
        process.env.JWT_SECRET!,
        { expiresIn: "7d" }
      );
      cookies().set("userToken", token);
      const { password: string, ...rest } = userDoc;
      return { ...rest };
    }),
  loginUser: publicProcedure
    .input(
      z.object({
        email: z.string(),
        password: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const userDocFromDb = await db.user.findUnique({
        where: {
          email: input.email,
        },
      });
      if (!userDocFromDb || !userDocFromDb.email) {
        throw new TRPCError({
          message: "Wrong email or password",
          code: "UNAUTHORIZED",
          cause: "WRONG_EMAIL_OR_PASSWORD",
        });
      }
      const userPasswordCheck = await bcrypt.compare(
        input.password,
        userDocFromDb.password
      );
      if (!userPasswordCheck) {
        throw new TRPCError({
          message: "Wrong email or password",
          code: "UNAUTHORIZED",
          cause: "WRONG_EMAIL_OR_PASSWORD",
        });
      }
      const token = jwt.sign(
        {
          userId: userDocFromDb.id,
          userName: userDocFromDb.name,
          userEmail: userDocFromDb.email,
        },
        process.env.JWT_SECRET!,
        { expiresIn: "7d" }
      );
      cookies().set("userToken", token);
      const { password, ...rest } = userDocFromDb;
      return rest;
    }),
  logout: publicProcedure.mutation(async () => {
    try {
      cookies().set("userToken", "");
    } catch (err) {}
  }),
  oAuth: publicProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string(),
        image: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const findUser = await db.user.findFirst({
        where: {
          email: input.email,
          isOAuth: true,
        },
      });
      if (findUser) {
        const token = jwt.sign(
          {
            userId: findUser.id,
            userName: findUser.name,
            userEmail: findUser.email,
          },
          process.env.JWT_SECRET!,
          { expiresIn: "7d" }
        );
        cookies().set("userToken", token);
        const { password, ...rest } = findUser;
        return rest;
      } else {
        const uuid = uuidv4();
        const oAuthUser = await db.user.create({
          data: {
            name: input.name,
            email: input.email,
            image: input.image,
            password: uuid,
            isOAuth: true,
          },
        });
        const token = jwt.sign(
          {
            userId: oAuthUser.id,
            userName: oAuthUser.name,
            userEmail: oAuthUser.email,
          },
          process.env.JWT_SECRET!,
          { expiresIn: "7d" }
        );
        cookies().set("userToken", token);
        const { password, ...rest } = oAuthUser;
        return rest;
      }
    }),
  createBlog: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        userEmail: z.string(),
        title: z.string(),
        imageUrl: z.string(),
        blog_text: z.string(),
        category: z.string(),
        databaseCategory: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const existingUser = await db.user.findFirst({
        where: {
          id: input.userId,
          email: input.userEmail,
        },
      });
      if (!existingUser) {
        throw new TRPCError({
          message: "User not found",
          code: "UNAUTHORIZED",
        });
      }
      const blogDoc = await db.blog.create({
        data: {
          title: input.title,
          imageUrl: input.imageUrl,
          blog_text: input.blog_text,
          category: input.category,
          authorId: input.userId,
          categoryDatabase: input.databaseCategory,
        },
      });
      return blogDoc;
    }),
  getAllBlogs: publicProcedure.query(async () => {
    const blogDocs = await db.blog.findMany({
      include: {
        author: true,
      },
      orderBy: {
        date: "desc",
      },
    });
    return blogDocs;
  }),
  changeCoverImage: publicProcedure
    .input(z.object({ url: z.string() }))
    .mutation(async ({ input }) => {
      const token = cookies().get("userToken")?.value;
      if (!token) {
        throw new TRPCError({
          message: "Token not valid",
          code: "UNAUTHORIZED",
        });
      }
      const userData: any = jwt.verify(token, process.env.JWT_SECRET!);
      const updatedUser = await db.user.update({
        data: {
          coverImage: input.url,
        },
        where: {
          id: userData.userId,
          email: userData.userEmail,
        },
      });
      if (!updatedUser || !updatedUser.email) {
        throw new TRPCError({
          message: "User not valid",
          code: "NOT_FOUND",
        });
      }
      const { password, ...rest } = updatedUser;
      return rest;
    }),
  changeProfileImage: publicProcedure
    .input(z.object({ url: z.string() }))
    .mutation(async ({ input }) => {
      const token = cookies().get("userToken")?.value;
      if (!token) {
        throw new TRPCError({
          message: "Token not valid",
          code: "UNAUTHORIZED",
        });
      }
      const userData: any = jwt.verify(token, process.env.JWT_SECRET!);
      const updatedUser = await db.user.update({
        data: {
          image: input.url,
        },
        where: {
          id: userData.userId,
          email: userData.userEmail,
        },
      });
      if (!updatedUser || !updatedUser.email) {
        throw new TRPCError({
          message: "User not valid",
          code: "NOT_FOUND",
        });
      }
      const { password, ...rest } = updatedUser;
      return rest;
    }),
  changeUserName: publicProcedure
    .input(z.object({ newName: z.string() }))
    .mutation(async ({ input }) => {
      const token = cookies().get("userToken")?.value;
      if (!token) {
        throw new TRPCError({
          message: "Token not valid",
          code: "UNAUTHORIZED",
        });
      }
      const userData: any = jwt.verify(token, process.env.JWT_SECRET!);
      const { password, ...rest } = await db.user.update({
        data: {
          name: input.newName,
        },
        where: {
          id: userData.userId,
          email: userData.userEmail,
        },
      });

      return rest;
    }),
  getBlog: publicProcedure
    .input(z.object({ blogId: z.string() }))
    .query(async ({ input }) => {
      const blogDoc = await db.blog.findUnique({
        where: {
          id: input.blogId,
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
              saved: true,
              requests: true,
              friendList: true,
            },
          },
        },
      });
      if (!blogDoc) {
        throw new TRPCError({ message: "Blog Not Found", code: "NOT_FOUND" });
      }
      return blogDoc;
    }),
  likeblog: publicProcedure
    .input(z.object({ blogId: z.string(), userId: z.string() }))
    .mutation(async ({ input }) => {
      const blogDoc = await db.blog.findFirst({
        where: {
          id: input.blogId,
        },
      });
      const updateBlog = await db.blog.update({
        where: {
          id: input.blogId,
        },
        data: {
          likes: blogDoc?.likes.includes(input.userId)
            ? [...blogDoc?.likes?.filter((like) => like !== input.userId)!]
            : [...blogDoc?.likes!, input.userId],
          rating: blogDoc?.likes.length! + 1,
        },
      });
      if (!updateBlog) {
        throw new TRPCError({
          message: "Error on Updating blog",
          code: "FORBIDDEN",
        });
      }

      const userDoc = await db.user.findFirst({
        where: {
          id: input.userId,
        },
      });
      const updateUser = await db.user.update({
        where: {
          id: input.userId,
        },
        data: {
          favorites: userDoc?.favorites.includes(input.blogId)
            ? [
                ...userDoc.favorites.filter(
                  (favorite) => favorite !== input.blogId
                ),
              ]
            : [...userDoc?.favorites!, input.blogId],
        },
      });
      if (!updateUser) {
        throw new TRPCError({
          message: "Error on Updating user",
          code: "FORBIDDEN",
        });
      }
      return { success: true };
    }),
  countCommentsNumber: publicProcedure
    .input(z.object({ postId: z.string() }))
    .query(async ({ input }) => {
      const comments = await db.comment.findMany({
        where: {
          postId: input.postId,
        },
        select: {
          id: true,
        },
      });
      return comments;
    }),
  getAllComments: publicProcedure
    .input(z.object({ postId: z.string() }))
    .query(async ({ input }) => {
      const commentDocs = await db.comment.findMany({
        where: {
          postId: input.postId,
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          children: {
            include: {
              author: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
          },
        },
      });
      // TODO: Error Handling
      return commentDocs;
    }),
  createMainComment: publicProcedure
    .input(
      z.object({
        commentText: z.string(),
        postId: z.string(),
        authorId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const commentDoc = await db.comment.create({
        data: {
          commentText: input.commentText,
          postId: input.postId,
          authorId: input.authorId,
        },
      });
      if (!commentDoc) {
        throw new TRPCError({
          message: "Error while creating a main comment",
          code: "FORBIDDEN",
        });
      }
      return commentDoc;
    }),
  likeComment: publicProcedure
    .input(z.object({ commentId: z.string(), commentorId: z.string() }))
    .mutation(async ({ input }) => {
      const commentDoc = await db.comment.findUnique({
        where: {
          id: input.commentId,
        },
      });
      if (!commentDoc) {
        throw new TRPCError({
          message: "Comment not found when implement liking",
          code: "FORBIDDEN",
        });
      }
      const likeOrDislikeComment = await db.comment.update({
        where: {
          id: input.commentId,
        },
        data: {
          likes: commentDoc?.likes.includes(input.commentorId)
            ? [
                ...commentDoc.likes.filter(
                  (likeId) => likeId !== input.commentorId
                ),
              ]
            : [...commentDoc?.likes!, input.commentorId],
        },
      });
      if (!likeOrDislikeComment) {
        throw new TRPCError({
          message: "Error while updating comment like",
          code: "FORBIDDEN",
        });
      }
      return { success: true };
    }),
  deleteComment: publicProcedure
    .input(z.object({ commentId: z.string() }))
    .mutation(async ({ input }) => {
      const findComment = await db.comment.findUnique({
        where: { id: input.commentId },
      });
      if (!findComment?.parentId) {
        await db.comment.update({
          where: {
            id: findComment?.id,
          },
          data: {
            children: {
              deleteMany: {
                parentId: findComment?.id,
              },
            },
          },
        });
        await db.comment.delete({
          where: {
            id: findComment?.id,
          },
        });
        return { success: true };
      } else {
        await db.comment.delete({
          where: {
            id: findComment?.id,
          },
        });
        return { success: true };
      }
    }),
  createChildComment: publicProcedure
    .input(
      z.object({
        commentText: z.string(),
        postId: z.string(),
        authorId: z.string(),
        parentId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const findParentComment = await db.comment.findUnique({
        where: {
          id: input.parentId,
        },
      });
      if (!findParentComment) {
        throw new TRPCError({
          message: "Comment not found",
          code: "FORBIDDEN",
        });
      }
      const commentDoc = await db.comment.create({
        data: {
          commentText: input.commentText,
          postId: input.postId,
          authorId: input.authorId,
          parentId: input.parentId,
        },
      });
      if (!commentDoc) {
        throw new TRPCError({
          message: "Error while creating a main comment",
          code: "FORBIDDEN",
        });
      }
      return commentDoc;
    }),
  getBlogByCategory: publicProcedure
    .input(z.object({ category: z.string() }))
    .query(async ({ input }) => {
      if (input.category === "All") {
        const blogDocs = await db.blog.findMany({
          include: {
            author: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: {
            date: "desc",
          },
        });
        if (!blogDocs) {
          throw new TRPCError({
            message: "Error while getting blog by category",
            code: "FORBIDDEN",
          });
        }
        return blogDocs;
      } else {
        const blogDocs = await db.blog.findMany({
          where: {
            categoryDatabase: input.category,
          },
          include: {
            author: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: {
            date: "desc",
          },
        });
        if (!blogDocs) {
          throw new TRPCError({
            message: "Error while getting blog by category",
            code: "FORBIDDEN",
          });
        }
        return blogDocs;
      }
    }),
  createPost: publicProcedure
    .input(
      z.object({
        caption: z.string(),
        imageUrl: z.string(),
        authorId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const createdPost = await db.post.create({
        data: {
          caption: input.caption,
          imageUrl: input.imageUrl,
          authorId: input.authorId,
        },
      });
    }),
  getAllPost: publicProcedure
    .input(z.object({ authorId: z.string() }))
    .query(async ({ input }) => {
      const findUser = await db.user.findUnique({
        where: {
          id: input.authorId,
        },
      });
      if (!findUser) {
        throw new TRPCError({
          message: "Error while getting user",
          code: "FORBIDDEN",
        });
      }
      const postDocs = await db.post.findMany({
        where: {
          OR: [
            {
              authorId: findUser.id,
            },
            {
              authorId: {
                in: findUser.friendList,
              },
            },
          ],
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          comments: {
            include: {
              author: {
                select: {
                  id: true,
                  image: true,
                  name: true,
                },
              },
            },
          },
        },
        orderBy: {
          date: "desc",
        },
      });
      if (!postDocs) {
        throw new TRPCError({
          message: "Error while getting posts",
          code: "FORBIDDEN",
        });
      }
      return postDocs;
    }),
  deletePost: publicProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ input }) => {
      const deletedPost = await db.post.delete({
        where: {
          id: input.postId,
        },
      });
      if (!deletedPost) {
        throw new TRPCError({
          message: "Error while deleting post",
          code: "FORBIDDEN",
        });
      }
      return { success: true };
    }),
  likePost: publicProcedure
    .input(z.object({ postId: z.string(), userId: z.string() }))
    .mutation(async ({ input }) => {
      const findPost = await db.post.findUnique({
        where: {
          id: input.postId,
        },
      });
      if (!findPost) {
        throw new TRPCError({
          message: "Error while finding post like",
          code: "FORBIDDEN",
        });
      }
      const updatePostLike = await db.post.update({
        where: {
          id: findPost.id,
        },
        data: {
          likes: findPost.likes.includes(input.userId)
            ? [...findPost.likes.filter((post) => post !== input.userId)]
            : [...findPost.likes, input.userId],
        },
      });
      if (!updatePostLike) {
        throw new TRPCError({
          message: "Error while updating post like",
          code: "FORBIDDEN",
        });
      }

      return { success: true };
    }),
  createPostComment: publicProcedure
    .input(
      z.object({
        commentText: z.string(),
        postId: z.string(),
        userId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const createdPostComment = await db.postComment.create({
        data: {
          commentText: input.commentText,
          postId: input.postId,
          authorId: input.userId,
        },
      });
      if (!createdPostComment) {
        throw new TRPCError({
          message: "Error while creating post comment",
          code: "FORBIDDEN",
        });
      }
      return { success: true };
    }),
  postCommentDelete: publicProcedure
    .input(z.object({ commentId: z.string() }))
    .mutation(async ({ input }) => {
      const deletedComment = await db.postComment.delete({
        where: {
          id: input.commentId,
        },
      });
      if (!deletedComment) {
        throw new TRPCError({
          message: "Error while deleting post comment",
          code: "FORBIDDEN",
        });
      }
      return { success: true };
    }),
  postCommentLikes: publicProcedure
    .input(z.object({ commentId: z.string(), authorId: z.string() }))
    .mutation(async ({ input }) => {
      const findComment = await db.postComment.findUnique({
        where: {
          id: input.commentId,
        },
      });
      if (!findComment) {
        throw new TRPCError({
          message: "Error while finding post comment for like",
          code: "FORBIDDEN",
        });
      }
      const updateCommentLikes = await db.postComment.update({
        where: {
          id: findComment?.id,
        },
        data: {
          likes: findComment?.likes.includes(input.authorId)
            ? [
                ...findComment.likes.filter(
                  (comment) => comment !== input.authorId
                ),
              ]
            : [...findComment?.likes!, input.authorId],
        },
      });
      if (!updateCommentLikes) {
        throw new TRPCError({
          message: "Error while updating post comment for like",
          code: "FORBIDDEN",
        });
      }
      return { success: true };
    }),
  searchUserAndBlogs: publicProcedure
    .input(z.object({ userName: z.string(), blogTitle: z.string() }))
    .mutation(async ({ input }) => {
      const peopleDocs = await db.user.findMany({
        where: {
          name: {
            contains: input.userName,
            mode: "insensitive",
          },
        },
        select: {
          id: true,
          name: true,
          image: true,
          requests: true,
          friendList: true,
        },
      });
      if (!peopleDocs) {
        throw new TRPCError({
          message: "Error while searching for peoples",
          code: "FORBIDDEN",
        });
      }
      const blogDocs = await db.blog.findMany({
        where: {
          title: {
            contains: input.blogTitle,
            mode: "insensitive",
          },
        },
      });
      if (!blogDocs) {
        throw new TRPCError({
          message: "Error while searching for blogs",
          code: "FORBIDDEN",
        });
      }
      const token = cookies().get("userToken")?.value;
      if (!token) {
        return { peoples: peopleDocs, blogs: blogDocs };
      }
      const userData: any = jwt.verify(token!, process.env.JWT_SECRET!);
      const notYou = peopleDocs.filter(
        (people) => people.id !== userData?.userId
      );
      return { peoples: notYou, blogs: blogDocs };
    }),
  getUserById: publicProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ input }) => {
      const userDoc = await db.user.findUnique({
        where: {
          id: input.userId,
        },
        select: {
          id: true,
          name: true,
          image: true,
          coverImage: true,
          favorites: true,
          email: true,
        },
      });
      if (!userDoc) {
        throw new TRPCError({
          message: "Error while getting user by id",
          code: "FORBIDDEN",
        });
      }
      return userDoc;
    }),
  getUserBlogsData: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      const blogDocs = await db.blog.findMany({
        where: {
          authorId: input.userId,
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
              email: true,
            },
          },
        },
      });
      if (!blogDocs) {
        throw new TRPCError({
          message: "Error while getting user blogs data",
          code: "FORBIDDEN",
        });
      }
      return blogDocs;
    }),
  getUserFavoritesData: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      const userDoc = await db.user.findUnique({
        where: {
          id: input.userId,
        },
      });
      if (!userDoc) {
        throw new TRPCError({
          message: "Error while getting user blogs data",
          code: "FORBIDDEN",
        });
      }
      const blogDocs = await db.blog.findMany({
        where: {
          id: {
            in: userDoc?.favorites,
          },
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
              email: true,
            },
          },
        },
      });
      if (!blogDocs) {
        throw new TRPCError({
          message: "Error while getting user favorites blogs",
          code: "FORBIDDEN",
        });
      }
      return blogDocs;
    }),
  deleteBlog: publicProcedure
    .input(z.object({ blogId: z.string() }))
    .mutation(async ({ input }) => {
      const deletedBlog = await db.blog.delete({
        where: {
          id: input.blogId,
        },
      });
      if (!deletedBlog) {
        throw new TRPCError({
          message: "Error while deleting blog",
          code: "FORBIDDEN",
        });
      }
      return { success: true };
    }),
  getBlogByIdAndEmail: publicProcedure
    .input(z.object({ blogId: z.string(), authorId: z.string() }))
    .query(async ({ input }) => {
      const blogDoc = await db.blog.findUnique({
        where: {
          id: input.blogId,
          authorId: input.authorId,
        },
      });
      if (!blogDoc) {
        throw new TRPCError({
          message: "Error while getting blog by user id and blog id",
          code: "FORBIDDEN",
        });
      }
      return blogDoc;
    }),
  updateBlog: publicProcedure
    .input(
      z.object({
        blogId: z.string(),
        userId: z.string(),
        title: z.string(),
        imageUrl: z.string(),
        blog_text: z.string(),
        category: z.string(),
        databaseCategory: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const updatedBlog = await db.blog.update({
        where: {
          id: input.blogId,
          authorId: input.userId,
        },
        data: {
          title: input.title,
          imageUrl: input.imageUrl,
          blog_text: input.blog_text,
          category: input.category,
          categoryDatabase: input.databaseCategory,
        },
      });
      if (!updatedBlog) {
        throw new TRPCError({
          message: "Error while updating blog",
          code: "FORBIDDEN",
        });
      }
      return updatedBlog;
    }),
  saveBlog: publicProcedure
    .input(z.object({ blogId: z.string(), userId: z.string() }))
    .mutation(async ({ input }) => {
      const existingUser = await db.user.findUnique({
        where: {
          id: input.userId,
        },
      });
      if (!existingUser) {
        throw new TRPCError({
          message: "Error while saving blog",
          code: "FORBIDDEN",
        });
      }
      const updatedUser = await db.user.update({
        where: {
          id: existingUser.id,
        },
        data: {
          saved: existingUser.saved.includes(input.blogId)
            ? [
                ...existingUser.saved.filter(
                  (savedIds) => savedIds !== input.blogId
                ),
              ]
            : [...existingUser.saved, input.blogId],
        },
      });
      if (!updatedUser) {
        throw new TRPCError({
          message: "Error while saving blog",
          code: "FORBIDDEN",
        });
      }
      return { success: true };
    }),
  getSavedBlogs: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      const userDoc = await db.user.findUnique({
        where: {
          id: input.userId,
        },
      });
      if (!userDoc) {
        throw new TRPCError({
          message: "Error while getting saved blogs",
          code: "FORBIDDEN",
        });
      }
      const blogDocs = await db.blog.findMany({
        where: {
          id: {
            in: userDoc.saved,
          },
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
              email: true,
              saved: true,
            },
          },
        },
      });
      if (!blogDocs) {
        throw new TRPCError({
          message: "Error while getting saved blogs",
          code: "FORBIDDEN",
        });
      }
      return blogDocs;
    }),
  sendRequest: publicProcedure
    .input(z.object({ peopleId: z.string(), userId: z.string() }))
    .mutation(async ({ input }) => {
      const userDoc = await db.user.findUnique({
        where: {
          id: input.userId,
        },
      });
      const peopleDoc = await db.user.findUnique({
        where: {
          id: input.peopleId,
        },
      });
      const { requests, friendList } = await db.user.update({
        where: {
          id: peopleDoc?.id,
        },
        data: {
          requests: peopleDoc?.requests.includes(input.userId)
            ? [...peopleDoc?.requests.filter((id) => id !== input.userId)]
            : [...peopleDoc?.requests!, input.userId],
        },
      });
      return {
        friendList,
        requests,
        id: userDoc?.id,
        image: userDoc?.image,
        name: userDoc?.name,
      };
    }),
  getUserNotifications: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      const userDoc = await db.user.findUnique({
        where: {
          id: input.userId,
        },
        select: {
          requests: true,
        },
      });
      const notificationData = await db.user.findMany({
        where: {
          id: {
            in: userDoc?.requests,
          },
        },
        select: {
          id: true,
          name: true,
          image: true,
        },
      });
      return notificationData;
    }),
  cancelRequest: publicProcedure
    .input(z.object({ userId: z.string(), peopleId: z.string() }))
    .mutation(async ({ input }) => {
      const findUser = await db.user.findUnique({
        where: {
          id: input.userId,
        },
        select: {
          requests: true,
        },
      });
      const updateUserRequest = await db.user.update({
        where: {
          id: input.userId,
        },
        data: {
          requests: [
            // @ts-ignore
            ...findUser?.requests?.filter(
              (request) => request !== input.peopleId
            ),
          ],
        },
      });
      return { success: true };
    }),
  acceptFriend: publicProcedure
    .input(z.object({ peopleId: z.string(), userId: z.string() }))
    .mutation(async ({ input }) => {
      const userDoc = await db.user.findUnique({
        where: {
          id: input.userId,
        },
        select: {
          requests: true,
          friendList: true,
        },
      });
      if (!userDoc) {
        throw new TRPCError({
          message: "Error while accepting friend request",
          code: "FORBIDDEN",
        });
      }
      const userDoc2 = await db.user.findUnique({
        where: {
          id: input.peopleId,
        },
        select: {
          friendList: true,
        },
      });
      if (!userDoc2) {
        throw new TRPCError({
          message: "Error while accepting friend request",
          code: "FORBIDDEN",
        });
      }
      const updateUser = await db.user.update({
        where: {
          id: input.userId,
        },
        data: {
          requests: [...userDoc.requests.filter((id) => id !== input.peopleId)],
          friendList: [input.peopleId, ...userDoc.friendList],
        },
      });
      if (!updateUser) {
        throw new TRPCError({
          message: "Error while accepting friend request",
          code: "FORBIDDEN",
        });
      }
      const updatedUser2 = await db.user.update({
        where: {
          id: input.peopleId,
        },
        data: {
          friendList: [input.userId, ...userDoc2.friendList],
        },
      });
      if (!updatedUser2) {
        throw new TRPCError({
          message: "Error while accepting friend request",
          code: "FORBIDDEN",
        });
      }
      return { success: true };
    }),
  trendingBlogs: publicProcedure.query(async () => {
    const blogDocs = await db.blog.findMany({
      where: {
        rating: {
          gt: 0.1,
        },
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
      take: 8,
    });
    if (!blogDocs) {
      throw new TRPCError({
        message: "Error while getting trending blogs",
        code: "FORBIDDEN",
      });
    }
    return blogDocs;
  }),
  // allTrendingBlogs: publicProcedure.query(async () => {
  //   const blogDocs = await db.blog.findMany({
  //     where: {
  //       rating: {
  //         gt: 0.1,
  //       },
  //     },
  //     include: {
  //       author: {
  //         select: {
  //           id: true,
  //           name: true,
  //           image: true,
  //         },
  //       },
  //     },
  //   });
  //   if (!blogDocs) {
  //     throw new TRPCError({
  //       message: "Error while getting trending blogs",
  //       code: "FORBIDDEN",
  //     });
  //   }
  //   return blogDocs;
  // }),
  getTredingBlogByCategory: publicProcedure
    .input(z.object({ category: z.string() }))
    .query(async ({ input }) => {
      if (input.category === "All") {
        const blogDocs = await db.blog.findMany({
          where: {
            rating: {
              gt: 0.1,
            },
          },
          include: {
            author: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        });
        if (!blogDocs) {
          throw new TRPCError({
            message: "Error while getting blog by category",
            code: "FORBIDDEN",
          });
        }
        return blogDocs;
      } else {
        const blogDocs = await db.blog.findMany({
          where: {
            category: {
              equals: input.category,
            },
            rating: {
              gt: 0.1,
            },
          },
          include: {
            author: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        });
        if (!blogDocs) {
          throw new TRPCError({
            message: "Error while getting blog by category",
            code: "FORBIDDEN",
          });
        }
        return blogDocs;
      }
    }),
  gettingMyFriends: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      const findUserFriendList = await db.user.findUnique({
        where: {
          id: input.userId,
        },
        select: {
          friendList: true,
        },
      });
      if (!findUserFriendList) {
        throw new TRPCError({
          message: "Error while getting user friends",
          code: "FORBIDDEN",
        });
      }
      const userAllFriends = await db.user.findMany({
        where: {
          id: {
            in: findUserFriendList.friendList,
          },
        },
        select: {
          id: true,
          name: true,
          image: true,
          friendList: true,
        },
      });
      if (!userAllFriends) {
        throw new TRPCError({
          message: "Error while getting user friends",
          code: "FORBIDDEN",
        });
      }
      return userAllFriends;
    }),
  unFriend: publicProcedure
    .input(z.object({ userId: z.string(), friendId: z.string() }))
    .mutation(async ({ input }) => {
      // updating my id
      const userDoc = await db.user.findUnique({
        where: {
          id: input.userId,
        },
        select: {
          friendList: true,
        },
      });
      if (!userDoc) {
        throw new TRPCError({
          message: "Error while unfriend user",
          code: "FORBIDDEN",
        });
      }
      const updateUser = await db.user.update({
        where: {
          id: input.userId,
        },
        data: {
          // @ts-ignore
          friendList: userDoc?.friendList.includes(input.friendId)
            ? [
                ...userDoc.friendList.filter(
                  (friend) => friend !== input.friendId
                ),
              ]
            : null,
        },
      });
      if (!updateUser) {
        throw new TRPCError({
          message: "Error while unfriend user",
          code: "FORBIDDEN",
        });
      }
      // updating friend id
      const friendDoc = await db.user.findUnique({
        where: {
          id: input.friendId,
        },
        select: {
          friendList: true,
        },
      });
      if (!friendDoc) {
        throw new TRPCError({
          message: "Error while unfriend user",
          code: "FORBIDDEN",
        });
      }
      const updateFriend = await db.user.update({
        where: {
          id: input.friendId,
        },
        data: {
          // @ts-ignore
          friendList: friendDoc?.friendList.includes(input.userId)
            ? [
                ...friendDoc.friendList.filter(
                  (friend) => friend !== input.userId
                ),
              ]
            : null,
        },
      });
      if (!updateFriend) {
        throw new TRPCError({
          message: "Error while unfriend user",
          code: "FORBIDDEN",
        });
      }
      return { success: true };
    }),
  createMessage: publicProcedure
    .input(
      z.object({ messageText: z.string(), from: z.string(), to: z.string() })
    )
    .mutation(async ({ input }) => {
      const createMessage = await db.message.create({
        data: {
          messageText: input.messageText,
          from: input.from,
          to: input.to,
        },
      });
      if (!createMessage) {
        throw new TRPCError({
          message: "Error while creating a message",
          code: "FORBIDDEN",
        });
      }
      return { createMessage };
    }),
  getMessages: publicProcedure
    .input(z.object({ from: z.string(), to: z.string() }))
    .query(async ({ input }) => {
      const myMessageDocs = await db.message.findMany({
        where: {
          from: input.from,
          to: input.to,
        },
      });
      if (!myMessageDocs) {
        throw new TRPCError({
          message: "Error while getting messages",
          code: "FORBIDDEN",
        });
      }
      const friendMessageDocs = await db.message.findMany({
        where: {
          from: input.to,
          to: input.from,
        },
      });
      if (!friendMessageDocs) {
        throw new TRPCError({
          message: "Error while getting messages",
          code: "FORBIDDEN",
        });
      }
      return { myMessageDocs, friendMessageDocs };
    }),
  deleteAllConversation: publicProcedure
    .input(z.object({ userId: z.string(), friendId: z.string() }))
    .mutation(async ({ input }) => {
      const deleteMyMessages = await db.message.deleteMany({
        where: {
          from: input.userId,
          to: input.friendId,
        },
      });
      const deleteFriendMessages = await db.message.deleteMany({
        where: {
          from: input.friendId,
          to: input.userId,
        },
      });
      return { success: true };
    }),
  deleteMessage: publicProcedure
    .input(z.object({ messageId: z.string() }))
    .mutation(async ({ input }) => {
      const deletedMessage = await db.message.delete({
        where: {
          id: input.messageId,
        },
      });
      return { success: true };
    }),
});

export type AppRouter = typeof appRouter;
