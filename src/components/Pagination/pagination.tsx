import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
const Pagination = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 20;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const page = params.get("Page");
    if (page) {
      setCurrentPage(parseInt(page));
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
      setCurrentPage(page);
    }
  };

  return (
    <div className="flex flex-col items-center w-full ">
      <div className="flex items-center justify-between w-full space-x-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 flex   items-center gap-[2px] rounded border disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Image
            src="/svgs/prevsymbol.svg"
            width={20}
            height={20}
            alt="previous_symbol"
          />
          Previous
        </button>

        <div className="flex items-center gap-3">
          {getPageNumbers().map((page, index) => (
            <button
              key={index}
              onClick={() => changePageHandler(page)}
              className={`px-3 py-2 rounded border tracking-widest  ${
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

        <button
          onClick={() => {
            setCurrentPage((prev) => Math.min(totalPages, prev + 1));
          }}
          disabled={currentPage === totalPages}
          className="px-2 flex gap-[2px] py-8 items-center rounded border disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
          <Image
            src="/svgs/nextsymbol.svg"
            width={20}
            height={20}
            alt="next_symbol"
          />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
