"use client";

import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { Blog, useSearchBlogsMutation } from "../../api/blog";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";

const items = [
  {
    title: "The Dawn of Innovation",
    description: "Explore the birth of groundbreaking ideas and inventions.",
    header: (
      <img
        src={
          "https://ichef.bbci.co.uk/ace/standard/976/cpsprodpb/14235/production/_100058428_mediaitem100058424.jpg"
        }
        alt="Hero"
        className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl"
      />
    ),
  },
  {
    title: "The Dawn of Innovation",
    description: "Explore the birth of groundbreaking ideas and inventions.",
    header: "Test",
  },
  {
    title: "The Dawn of Innovation",
    description: "Explore the birth of groundbreaking ideas and inventions.",
    header: "Test",
  },
  {
    title: "The Dawn of Innovation",
    description: "Explore the birth of groundbreaking ideas and inventions.",
    header: "Test",
  },
  {
    title: "The Dawn of Innovation",
    description: "Explore the birth of groundbreaking ideas and inventions.",
    header: "Test",
  },
  {
    title: "The Dawn of Innovation",
    description: "Explore the birth of groundbreaking ideas and inventions.",
    header: "Test",
  },
  {
    title: "The Dawn of Innovation",
    description: "Explore the birth of groundbreaking ideas and inventions.",
    header: "Test",
  },
];

export default function Home() {
  const [searchBlogs, { isLoading, data: blogResponse }] =
    useSearchBlogsMutation();

  useEffect(() => {
    searchBlogs({});
  }, []);

  return (
    <BentoGrid>
      {isLoading && <Spinner />}
      {blogResponse?.blogs?.map((blog, index) => (
        <BentoGridItem
          key={index}
          title={blog.title}
          description={blog.des}
          header={
            <img
              src={blog.banner}
              alt="Hero"
              className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl"
            />
          }
          className={index === 3 || index === 6 ? "md:col-span-2" : ""}
        />
      ))}
    </BentoGrid>
  );
}
