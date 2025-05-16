"use client";

import { Button, Flex, Table } from "@mantine/core";
import { useSearchBlogsMutation } from "../../../../api/blog";
import { useEffect } from "react";

function BlogPage() {
  const [searchBlogs, { data: blogList }] = useSearchBlogsMutation();

  const rows = blogList?.blogs?.map((blog, index) => (
    <Table.Tr
      key={index}
      style={{
        background: index % 2 === 0 ? "#f8fafc" : "white",
        transition: "background 0.2s",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#e0e7ff")}
      onMouseLeave={(e) =>
        (e.currentTarget.style.background =
          index % 2 === 0 ? "#f8fafc" : "white")
      }
    >
      <Table.Td>{blog.title}</Table.Td>
      <Table.Td>{blog.author.personal_info.username}</Table.Td>
      <Table.Td>
        {blog.tags?.map((tag, index) => {
          return (
            <span
              key={index}
              style={{
                background: "#e0e7ff",
                padding: "4px 8px",
                borderRadius: "4px",
                marginRight: "4px",
              }}
            >
              {tag}
            </span>
          );
        })}
      </Table.Td>
      <Table.Td>{blog.activity.total_likes}</Table.Td>
      <Table.Td>{blog.activity.total_comments}</Table.Td>
      <Table.Td>{blog.activity.total_reads}</Table.Td>
      <Table.Td>
        <Flex gap={5}>
          <Button
            onClick={() => {
              window.location.href = `/admin/blog/edit/${blog.blog_id}`;
            }}
          >
            Edit
          </Button>
          <Button variant="outline" color={"red"}>
            Delete
          </Button>
        </Flex>
      </Table.Td>
    </Table.Tr>
  ));

  /*
  {
  "activity": {
    "total_likes": 0,
    "total_comments": 0,
    "total_reads": 12,
    "total_parent_comments": 0
  },
  "blog_id": "Lorem-Ipsum-dolores-3g4YWUWYlz46VZ8_jI-2YT",
  "title": "Lorem Ipsum dolores 3",
  "banner": "https://ichef.bbci.co.uk/ace/standard/976/cpsprodpb/14235/production/_100058428_mediaitem100058424.jpg",
  "des": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. ",
  "tags": [
    "news"
  ],
  "author": {
    "personal_info": {
      "fullName": "tester123",
      "username": "archerdoc13",
      "profile_img": "https://api.dicebear.com/6.x/adventurer-neutral/svg?seed=Abby"
    }
  },
  "publishedAt": "2025-05-07T17:36:00.141Z"
}
  */

  useEffect(() => {
    searchBlogs({});
  }, []);

  return (
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Title</Table.Th>
          <Table.Th>User</Table.Th>
          <Table.Th>Tags</Table.Th>
          <Table.Th>Likes</Table.Th>
          <Table.Th>Comments</Table.Th>
          <Table.Th>Reads</Table.Th>
          <Table.Th>Actions</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
  );
}

export default BlogPage;
