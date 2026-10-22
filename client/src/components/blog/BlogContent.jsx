const Img = ({ src, caption }) => {
  return (
    <div>
      <img src={src} className="rounded-[1rem]" />
      {caption.length ? (
        <p className="w-full text-center my-3 md:mb-12 text-base text-dark-grey">
          {caption}
        </p>
      ) : (
        ""
      )}
    </div>
  );
};

const Quote = ({ quote, caption }) => {
  return (
    <div className="my-8 pl-6 border-l-4 border-accent">
      <p className="!text-2xl md:!text-3xl !font-bold !leading-snug">{quote}</p>
      {caption.length ? (
        <p className="w-full mt-3 !text-muted !text-base !font-semibold">{caption}</p>
      ) : (
        ""
      )}
    </div>
  );
};

const List = ({ style, items }) => {
  return (
    <ol className={`pl-5 ${style == "ordered" ? "list-decimal" : "list-disc"}`}>
      {items.map((item, index) => (
        <li
          key={index}
          className="my-4"
          dangerouslySetInnerHTML={{ __html: item }}
        ></li>
      ))}
    </ol>
  );
};

const BlogContent = ({ block }) => {
  const { type, data } = block;

  if (type == "paragraph") {
    return <p dangerouslySetInnerHTML={{ __html: data.text }}></p>;
  }

  if (type == "header") {
    if (data.level == 3) {
      return (
        <h3
          className="text-3xl font-bold"
          dangerouslySetInnerHTML={{ __html: data.text }}
        ></h3>
      );
    }

    return (
      <h2
        className="text-4xl font-bold"
        dangerouslySetInnerHTML={{ __html: data.text }}
      ></h2>
    );
  }

  if (type == "image") {
    return <Img src={data.file.url} caption={data.caption} />;
  }

  if (type == "quote") {
    return <Quote quote={data.text} caption={data.caption} />;
  }

  if (type == "list") {
    return <List style={data.style} items={data.items} />;
  }

  if (type == "linkTool") {
    const videoId = getVideoId(data.link);
    console.log(videoId);
    return (
      <iframe
        className="w-full"
        src={`https://www.youtube.com/embed/${videoId}`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }
};

function getVideoId(url) {
  const urlParams = new URL(url).searchParams;
  return urlParams.get("v");
}

export default BlogContent;
