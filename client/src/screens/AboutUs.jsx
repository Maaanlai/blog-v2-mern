import { useState } from "react";
import { user } from "../assets";
import {
  BriefcaseIcon,
  PuzzlePieceIcon,
  AcademicCapIcon,
  LightBulbIcon,
} from "@heroicons/react/24/outline";

const AboutUs = () => {
  const [faqOpen, setFaqOpen] = useState(null);
  const toggleFAQ = (index) => {
    setFaqOpen(faqOpen === index ? null : index);
  };

  const values = [
    {
      title: "Мэргэжлийн байх",
      description:
        "Бид харилцагч нартаа мэргэжлийн түвшний үйлчилгээг үзүүлэхийг нэн тэргүүнд эрхэмлэдэг.",
      icon: BriefcaseIcon,
    },
    {
      title: "Тусгайлан боловсруулсан шийдэл",
      description:
        "Харилцагч бүрийн хэрэгцээнд тохируулсан шийдлийг мэргэжлийн өндөр түвшинд боловсруулдаг.",
      icon: PuzzlePieceIcon,
    },
    {
      title: "Мэдлэг, чадвартай бизнес",
      description:
        "Харилцагчдадаа дотоодын МУТС-тэй тэмцэх үйл ажиллагааг бүрдүүлж бэхжүүлэхэд шаардлагатай зөвлөгөө, сургалтыг олгодог.",
      icon: AcademicCapIcon,
    },
    {
      title: "Энгийн ба ойлгомжтой байдал",
      description:
        "Төвөгтэй зохицуулалтыг ойлгоход хялбар, хэрэгжүүлэхэд амар болгодог.",
      icon: LightBulbIcon,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-center mb-6">Бидний Тухай</h1>
      <p>
        Бид Мөнгө угаах болон терроризмыг санхүүжүүлэхтэй (МУТС) тэмцэх хүрээнд
        эрсдэлийн удирдлагыг хэрэгжүүлэх, холбогдох зохицуулалтыг дагаж мөрдөх
        чиглэлээр 10 орчим жил ажилласан туршлагатай комплаенс мэргэжилтнүүд юм.
        Бид бизнес эрхлэгчид, комплаенсийн мэргэжилтнүүдэд МУТС-тэй тэмцэх
        нарийн зохицуулалтын хүрээнд комплаенсийн хөтөлбөрийг үр дүнтэй
        хэрэгжүүлэхэд нь дэмжлэг үзүүлэх, эрсдэлийг үр дүнтэй удирдах, хууль
        тогтоомжийн шаардлагыг хангахад туслах мэргэжлийн шийдлүүд, сургалт
        үйлчилгээг санал болгох юм. Танай байгууллагын Комплаенс бол бидний
        тэргүүн зорилт юм.
      </p>

      {/* Алсын хараа & Эрхэм зорилго */}
      <section className="space-y-6 mt-6">
        {["Алсын хараа", "Эрхэм зорилго"].map((title, index) => (
          <div key={index} className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-semibold">{title}</h2>
            <p className="text-gray-700 mt-2">
              {index === 0
                ? "Комплаенс болон Мөнгө угаах болон терроризмыг санхүүжүүлэх (МУТС)-тэй тэмцэх хүрээнд сургалт, эрсдэлийн үнэлгээ, зөвлөх үйлчилгээ үзүүлдэг Монгол улсын тэргүүлэгч компани болох."
                : "Үнэ цэнтэй сургалт, үйлчилгээг хүргэх замаар Монгол Улсын хэмжээнд МУТС-тэй тэмцэх үйл ажиллагааг сайжруулахад хувь нэмрээ оруулах."}
            </p>
          </div>
        ))}
      </section>

      {/* Үнэт зүйлс */}
      <section className="mt-10">
        <h2 className="text-2xl font-semibold text-center">Үнэт зүйлс</h2>
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          {values.map((item, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-lg p-6 flex items-start gap-4"
            >
              <item.icon className="w-8 h-8 text-purple-600 flex-shrink-0" />
              <div>
                <p className="text-lg font-semibold leading-snug">
                  {item.title}
                </p>
                <p className="text-gray-700 mt-1">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Манай баг */}
      <section className="mt-10">
        <h2 className="text-2xl font-semibold text-center">Манай баг</h2>
        <div className="grid md:grid-cols-2 gap-6 mt-4">
          {["Б.Балжинням", "Б.Уянга"].map((name, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-lg p-6 text-center"
            >
              <img
                src={user}
                alt="Profile"
                className="w-24 h-24 rounded-full mx-auto"
              />
              <h3 className="text-xl font-semibold mt-2">{name}</h3>
              <p className="text-gray-600">
                {index === 0
                  ? "МУТС-тэй тэмцэх хүрээнд хориг арга хэмжээ, эрсдэлийн үнэлгээ, харилцагчийг таньж мэдэх ажиллагаа хийх чиглэлээр 6+ жилийн туршлагатай, Олон улсын комплаенсийн холбооны батламжтай Комплаенсийн мэргэжилтэн."
                  : "МУТС-тэй тэмцэх хүрээнд эрсдэлийн үнэлгээ болон харилцагчийг таньж мэдэх ажиллагаа хийх 9+ жилийн туршлагатай, Олон улсын комплаенсийн холбооны батламжтай Комплаенсийн мэргэжилтэн. "}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Түгээмэл асуултууд */}
      <section className="mt-10">
        <h2 className="text-2xl font-semibold text-center">
          Түгээмэл асуултууд
        </h2>
        <div className="mt-4 space-y-4">
          {[
            "Бидний үйлчилгээ юунд чиглэгддэг вэ?",
            "Яагаад комплаенс чухал вэ?",
          ].map((question, index) => (
            <div key={index} className="bg-white shadow-lg rounded-lg p-4">
              <button
                className="w-full text-left text-lg font-semibold"
                onClick={() => toggleFAQ(index)}
              >
                {question}
              </button>
              {faqOpen === index && (
                <p className="text-gray-700 mt-2">Энд хариулт байна...</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Facebook Link */}
      <div className="text-center mt-10">
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 font-semibold"
        >
          Facebook хуудсаар зочлох
        </a>
      </div>
    </div>
  );
};

export default AboutUs;
