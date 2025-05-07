"use client";

import { Card } from "@/components/ui/card";
import { useGetLastestBlogsMutation } from "../../api/blog";
import { useEffect } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Badge } from "@/components/ui/badge";

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 5,
    slidesToSlide: 3, // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 3,
    slidesToSlide: 2, // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 3,
    slidesToSlide: 1, // optional, default to 1.
  },
};

export default function Home() {
  const [getLatestBlogs, { isLoading, data: blogResponse }] =
    useGetLastestBlogsMutation();

  useEffect(() => {
    getLatestBlogs({});
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-5">
      <div
        style={{
          width: "100%",
          height: "100vh",
          scale: 1,
          position: "absolute",
          top: 0,
          left: 0,
          objectFit: "contain",
          filter: "brightness(0.4)",
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundImage:
            "url(https://images.saymedia-content.com/.image/ar_4:3%2Cc_fill%2Ccs_srgb%2Cq_auto:eco%2Cw_1200/MTk1NzA3MzI2ODM2MTg5MTIx/tailwind-hero-section.png)",
        }}
      />
      <div className="w-full h-full flex items-center justify-center z-10">
        <div className="w-1/2 flex flex-row ">
          <img
            src="https://images.saymedia-content.com/.image/ar_4:3%2Cc_fill%2Ccs_srgb%2Cq_auto:eco%2Cw_1200/MTk1NzA3MzI2ODM2MTg5MTIx/tailwind-hero-section.png"
            alt="Hero"
            className="rounded-md w-1/2"
          />
          <div className="flex flex-col p-4 gap-3 w-1/2">
            <h1 className="text-white text-3xl">Trending</h1>
            <h1 className="text-white text-2xl">{"This is a title"}</h1>
            <p className="text-white text-lg">
              {"Lorem ipsum dolores interrum"}
            </p>
          </div>
        </div>
      </div>
      <Carousel
        infinite
        swipeable
        responsive={responsive}
        className="w-full"
        itemClass="mx-5 mt-[100px]"
      >
        {isLoading && <p>Loading...</p>}
        {blogResponse?.blogs?.map((blog, index) => (
          <Card
            className="h-[400px] flex justify-end p-0 hover:scale-103 transition-all duration-300 relative overflow-visible"
            key={index}
            style={{
              backgroundImage: `url(${blog.banner})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              zIndex: -1,
            }}
            onClick={() => (window.location.href = `/blog/${blog.blog_id}`)}
          >
            <div className="h-[100px] p-5 bg-black/50 rounded-xl">
              <p className="text-white font-bold z-10">{blog.title}</p>
              <Badge className="bg-blue-400">{blog.tags[0]}</Badge>
            </div>
          </Card>
        ))}
      </Carousel>
      <p>test</p>
      <p>test</p>
      <p>test</p>
      <p>test</p>
      <p>test</p>
      <p>test</p>
      <p>test</p>
      <p>test</p>
      <p>test</p>
    </div>
  );
}
