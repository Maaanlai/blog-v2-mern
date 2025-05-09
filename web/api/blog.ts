import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

type PersonalInfo = {
  fullName: string;
  username: string;
  profile_img: string;
};

type Activity = {
  total_likes: number;
  total_comments: number;
  total_reads: number;
  total_parent_comments: number;
};

type Blog = {
  blog_id: string;
  title: string;
  banner: string;
  des: string;
  content: any[];
  tags: string[];
  author: {
    personal_info: PersonalInfo;
  };
  activity: Activity;
  publishedAt: string;
};

export const blogApi = createApi({
  reducerPath: "blogApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://127.0.0.1:9000/api/v1/blogs" }),
  endpoints: (build) => ({
    searchBlogs: build.mutation<{ status: number; blogs: Blog[] }, any>({
      query: (query) => {
        return {
          url: "/search",
          method: "POST",
          body: query,
        };
      },
    }),
    getLastestBlogs: build.mutation<{ status: number; blogs: Blog[] }, any>({
      query: (query) => {
        return {
          url: "/latest",
          method: "POST",
          body: query,
        };
      },
    }),
  }),
});

export type { PersonalInfo, Activity, Blog };
export const { useSearchBlogsMutation, useGetLastestBlogsMutation } = blogApi;
