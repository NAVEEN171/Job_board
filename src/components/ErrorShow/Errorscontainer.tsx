import React from "react";

const Errorscontainer = ({ errorshow }: { errorshow: string }) => {
  return (
    <div className="errorsshower fixed w-full  top-4 flex flex-col items-center  gap-[10px]">
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
  );
};

export default Errorscontainer;
