import React from "react";
import { useRouter } from "next/navigation";

const Herosection = () => {
  const router = useRouter();
  return (
    <div className="w-[100%] px-[40px] py-[20px] text-center break-words">
      <h1 className="text-[2.3rem]   mt-[40px] text-[900] text-[#0066cc] ">
        Build, Manage and Analyze Your
        <span className="text-[#3a90ff]"> Perfect Job Board</span>
      </h1>
      <h6 className="text-[#807C77]  mt-[30px]  text-[1.3rem] text-[500]">
        Create a custom job board tailored to your needs with ease. Manage
        listings, gain valuable insights into job market trends, and customize
        features like job filters, ratings, and analytics
      </h6>
      <button
        onClick={() => {
          router.push("/Resume-tailor");
        }}
        className="bg-[#4AA3FA] mt-5 text-lg px-7 py-3 font-semibold rounded-lg text-white cursor-pointer shadow-md"
      >
        AI Resume Tailor 📝
      </button>
    </div>
  );
};

export default Herosection;
