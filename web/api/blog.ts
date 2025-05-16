import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

type PersonalInfo = {
  access_token: string;
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
  content: string;
  tags: string[];
  author: {
    personal_info: PersonalInfo;
  };
  activity: Activity;
  publishedAt: string;
};

export const blogApi = createApi({
  reducerPath: "blogApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://127.0.0.1:9000/api/v1/blogs",
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MWEzZGZmNWY3OTc2Zjk5N2VmNmJlMyIsImlhdCI6MTc0NzQwMTI1NH0.-iNM8ZB5Qg6hWxD-N-xC1r8bTZsvUt585MSImnPNW_w",
    },
  }),
  endpoints: (build) => ({
    getBlogById: build.mutation<{ status: number; blog: Blog }, { id: string }>(
      {
        query: ({ id }) => {
          return {
            url: `/get-blog`,
            method: "POST",
            body: { blog_id: id },
          };
        },
      }
    ),
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
    updateBlog: build.mutation<
      { status: number },
      { blog_id: string; content: string | undefined }
    >({
      query: (data) => {
        return {
          url: "/update/content",
          method: "POST",
          body: data,
        };
      },
    }),
  }),
});

export type { PersonalInfo, Activity, Blog };
export const {
  useSearchBlogsMutation,
  useGetLastestBlogsMutation,
  useGetBlogByIdMutation,
  useUpdateBlogMutation,
} = blogApi;
