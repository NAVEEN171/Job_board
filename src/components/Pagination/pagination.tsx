import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import store from "@/store";
import { Authactions } from "@/store/Substores/Authslice";

const Pagination = () => {
  const dispatch = useDispatch();
  type RootState = ReturnType<typeof store.getState>;

  const router = useRouter();
  const currentPage = useSelector((state: RootState) => state.Auth.currentPage);
  const totalPages = useSelector((state: RootState) => state.Auth.totalPages);

  // const totalPages = 20;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const page = params.get("Page");
    if (page) {
      dispatch(Authactions.setCurrentPage(parseInt(page)));
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (currentPage !== undefined) {
      params.set("Page", currentPage.toString());
    }
    const newurl = `${window.location.pathname}?${params.toString()}`;
    router.push(newurl, { scroll: false });
  }, [currentPage]);

  const getPageNumbers = () => {
    const pages = [];

    if (totalPages <= 3) {
      // Show all pages if total is 7 or less
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      // Show pages around current page
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const changePageHandler = (page: number | string) => {
    if (typeof page === "number") {
      dispatch(Authactions.setCurrentPage(page));
    }
  };

  return (
    <div className="flex flex-col items-center mt-5 w-full ">
      <div className="flex flex-row xs:flex-col  xs:justify-center items-center justify-between w-full xs:space-x-1 space-x-2">
        <button
          onClick={() =>
            dispatch(
              Authactions.setCurrentPage(Math.max(1, (currentPage || 1) - 1))
            )
          }
          disabled={currentPage === 1}
          className="px-3 py-1 xs:hidden flex  border-none xs:text-sm items-center gap-[2px] rounded border disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Image
            src="/svgs/prevsymbol.svg"
            width={20}
            height={20}
            className="w-5 h-5 xs:h-3"
            alt="previous_symbol"
          />
          Previous
        </button>

        <div className="flex flex-wrap items-center xs:gap-1 gap-3">
          {getPageNumbers().map((page, index) => (
            <button
              key={index}
              onClick={() => changePageHandler(page)}
              className={`px-3 py-2 xs:px-2 h-fit rounded xs:text-xs font-medium border tracking-widest  ${
                currentPage === page
                  ? "bg-blue-500 text-white"
                  : page === "..."
                  ? "cursor-default border-none"
                  : "bg-gray-200 hover:bg-blue-200"
              }`}
              disabled={page === "..."}
            >
              {page}
            </button>
          ))}
        </div>
        <div className="xs:flex w-full justify-between items-center hidden">
          <button
            onClick={() =>
              dispatch(
                Authactions.setCurrentPage(Math.max(1, (currentPage || 1) - 1))
              )
            }
            disabled={currentPage === 1}
            className="px-3 py-1  flex  border-none  items-center gap-[2px] rounded border disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Image
              src="/svgs/prevsymbol.svg"
              width={20}
              height={20}
              className="w-5 h-5 xs:h-3"
              alt="previous_symbol"
            />
            Previous
          </button>
          <button
            onClick={() => {
              dispatch(
                Authactions.setCurrentPage(
                  Math.min(totalPages, (currentPage || 1) + 1)
                )
              );
            }}
            disabled={currentPage === totalPages}
            className="px-2  border-none flex gap-[2px] py-3 items-center rounded border disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <Image
              src="/svgs/nextsymbol.svg"
              width={20}
              height={20}
              className="w-5 h-5 xs:h-3"
              alt="next_symbol"
            />
          </button>
        </div>

        <button
          onClick={() => {
            dispatch(
              Authactions.setCurrentPage(
                Math.min(totalPages, (currentPage || 1) + 1)
              )
            );
          }}
          disabled={currentPage === totalPages}
          className="px-2 xs:hidden border-none flex gap-[2px] xs:text-sm py-3 items-center rounded border disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
          <Image
            src="/svgs/nextsymbol.svg"
            width={20}
            height={20}
            className="w-5 h-5 xs:h-3"
            alt="next_symbol"
          />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
