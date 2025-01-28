"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar/Navbar";
import OvalLoader from "@/components/ovalLoader/ovalLoader";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { Authactions } from "@/store/Substores/Authslice";

const page = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [loading, setloading] = useState<boolean>(false);
  const [token, settoken] = useState<string | null>(null);
  const [errorshow, seterrorshow] = useState<string>("");
  const params = useSearchParams();
  useEffect(() => {
    if (params && params.has("token")) {
      settoken(params.get("token"));
    }
  }, [params]);

  useEffect(() => {
    const fetchData = async () => {
      console.log(token);
      setloading(true);
      let response = await fetch(`api/verify/${token}`);
      let data;
      data = await response.json();

      if (response.ok) {
        if (data) {
          console.log(data);
          dispatch(Authactions.setloggedIn(true));

          router.push("/");
        }
      } else {
        seterrorshow(data.message);
        setTimeout(() => {
          seterrorshow("");
          router.push("/Signup");
        }, 3000);
      }
      setloading(false);
    };
    if (token) {
      fetchData();
    }
  }, [token]);
  console.log(params.get("token"));
  return (
    <div className="w-full  h-screen">
      <div className="error container absolute top-[10px] flex flex-col items-center">
        {errorshow && (
          <div
            style={{
              zIndex: 10000,
            }}
            className="   text-lg  border-4 border-white w-fit bg-gradient-to-r from-blue-500/70 to-blue-600/70 py-4  px-8 text-white shadow-2xl rounded-[10px] backdrop-blur-sm"
          >
            {errorshow}
          </div>
        )}
      </div>
      <Navbar />
      <div className="h-[calc(100%-100px)] flex items-center justify-center w-full">
        {loading && <OvalLoader />}
      </div>
    </div>
  );
};

export default page;
