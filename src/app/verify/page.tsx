"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
useSearchParams;
const page = () => {
  const [loading, setloading] = useState<string>("loading");
  const [token, settoken] = useState<string | null>(null);
  const params = useSearchParams();
  useEffect(() => {
    if (params && params.has("token")) {
      settoken(params.get("token"));
    }
  }, [params]);

  useEffect(() => {
    const fetchData = async () => {
      console.log(token);
      let response = await fetch(`api/verify/${token}`);
    };
    if (token) {
      fetchData();
    }
  }, [token]);
  console.log(params.get("token"));
  return <div></div>;
};

export default page;
