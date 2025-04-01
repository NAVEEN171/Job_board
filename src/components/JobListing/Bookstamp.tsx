import React, { useState, useEffect, useRef } from "react";
import "../../app/globals.css";
import { useDispatch, useSelector } from "react-redux";
import store from "@/store";
import { Authactions } from "@/store/Substores/Authslice";

type BookstampProps = {
  jobId: string;
};

const Bookstamp: React.FC<BookstampProps> = ({ jobId }) => {
  const dispatch = useDispatch();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [bookmark, setBookmark] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(false);
  type RootState = ReturnType<typeof store.getState>;
  const userId = useSelector((state: RootState) => state.Auth.UserId);
  const user = useSelector((state: RootState) => state.Auth.User);

  useEffect(() => {
    if (!user || !user?.savedJobs) {
      return;
    }
    if (user.savedJobs.includes(jobId)) {
      setSaved(true);
    }
  }, [user]);

  async function getUserData() {
    let response = await fetch(`/api/get-user/${userId}`);
    let data = await response.json();
    if (response.ok && data.user) {
      dispatch(Authactions.setUser(data.user));
    }
  }

  const bookmarkhandler = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!userId) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      dispatch(Authactions.seterrorshow("Please Login to Save Jobs"));
      timeoutRef.current = setTimeout(() => {
        dispatch(Authactions.seterrorshow(""));
      }, 3000);
      return;
    }
    try {
      setBookmark(true);

      setSaved(!saved);

      let response = await fetch(`/api/save-job/${jobId}?userId=${userId}`);
      if (response.ok) {
        getUserData();
      }
    } catch (err) {
    } finally {
      setBookmark(false);
    }
  };
  return (
    <div
      onClick={(e) => {
        bookmarkhandler(e);
      }}
      className={`book-mark-container relative ${
        bookmark ? "after:content-['']" : "border-blue-200 border-2"
      } cursor-pointer bg-white flex items-center justify-center relative 
      w-[30px] h-[30px] xs:w-[35px] xs:h-[35px] sm:w-[40px] sm:h-[40px] md:w-[45px] md:h-[45px] 
      border-blue-200 rounded-[4px] sm:rounded-[5px]`}
    >
      <div className="flex flex-col w-fit scale-75 xs:scale-80 sm:scale-90 md:scale-100">
        <div
          className={`w-[18px] h-[15px] ${
            !saved ? "bg-blue-200" : "bg-[#3a90ff]"
          }`}
        ></div>

        <div className="flex w-full justify-between">
          <div
            className={`w-1/2 h-0 border-r-[9px] border-t-[10px] border-l-transparent ${
              !saved ? "border-t-blue-200" : "border-t-[#3a90ff]"
            } border-r-transparent`}
          ></div>

          <div
            className={`w-1/2 h-0 border-l-[9px] border-t-[10px] border-l-transparent ${
              !saved ? "border-t-blue-200" : "border-t-[#3a90ff]"
            } border-r-transparent`}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Bookstamp;
