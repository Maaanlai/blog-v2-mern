import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import { BRAND } from "../utils/brand";

const services = [
  {
    title: "Сургалт",
    description:
      "Таны бизнесийн амжилтад зориулан бэлтгэсэн комплаенсийн тусгай шийдлүүдийг бид санал болгож байна.",
    items: [
      "Мөнгө угаах болон терроризмыг санхүүжүүлэх (МУТС)-тэй тэмцэх талаар ерөнхий ойлголт олгох сургалт",
      "Харилцагчийн судалгаа, харилцагчийг таньж мэдэх ажиллагааны талаар сургалт",
      "Санхүүгийн хориг арга хэмжээний талаар сургалт",
      "МУТС-тэй тэмцэх хүрээнд тусгайлсан сургалтын материал бэлтгэн, сургалт ордог.",
    ],
  },
  {
    title: "Эрсдэлийн үнэлгээ",
    items: [
      "Байгууллагын МУТС-тэй тэмцэх үйл ажиллагааны эрсдэлийг үнэлнэ.",
      "Эрсдэлийн үнэлгээнд суурилан эрсдэлийн удирдлагын стратегийг боловсруулж, зөвлөх үйлчилгээ үзүүлнэ.",
      "Танай байгууллагын эрсдэл өндөртэй харилцагчид нарийвчилсан судалгаа хийх, эрсдэлийн дүгнэлт, зөвлөмжийг боловсруулна.",
      "Байгууллагын МУТС эрсдэл өндөртэй шинэ бүтээгдэхүүн, үйлчилгээнд нарийвчилсан судалгаа хийж, эрсдэлийг үнэлж, холбогдох зөвлөмжийг боловсруулна.",
    ],
  },
  {
    title: "Бодлого, журам боловсруулах",
    items: [
      "МУТС-тэй тэмцэх болон түүнтэй холбоотой бусад нарийн бодлого, журмуудыг танай байгууллагад зориулан холбогдох хууль журамтай нийцүүлэн боловсруулна.",
      "Танай байгууллагын боловсруулсан байгаа бодлого, журмыг хянаж, сайжруулна.",
    ],
  },
];

const ProductsPage = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-center mb-8">
        Бүтээгдэхүүн, Үйлчилгээ
      </h1>
      {services.map((service, index) => (
        <div key={index} className="mb-6">
          <h2 className="text-2xl font-semibold text-purple-700">
            {service.title}
          </h2>
          {service.description && (
            <p className="text-gray-700 mt-2">{service.description}</p>
          )}
          <ul className="mt-2 space-y-2">
            {service.items.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-gray-700">
                <FaCheckCircle className="text-green-500 mt-1" /> {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
      <div className="text-center mt-10">
        <a
          href={BRAND.socials.facebook}
          className="text-blue-500 font-semibold mx-2"
          target="_blank"
          rel="noopener noreferrer"
        >
          Facebook
        </a>
        {BRAND.socials.instagram && (
          <a
            href={BRAND.socials.instagram}
            className="text-pink-500 font-semibold mx-2"
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram
          </a>
        )}
        {(BRAND.phone || BRAND.email) && (
          <p className="text-gray-700 mt-2">
            {BRAND.phone && <>Утас: {BRAND.phone}</>}
            {BRAND.phone && BRAND.email && " | "}
            {BRAND.email && <>И-мэйл: {BRAND.email}</>}
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
