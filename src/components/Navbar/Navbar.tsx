import React from 'react'

const Navbar = () => {
  return (
    <div className="h-[100px] w-full flex items-center justify-center">
        <div className="w-[90%] flex flex-row justify-between ">
          <h2 className="bg-[linear-gradient(180deg,_#0ca3f3_25%,_#098ee7_75%)] font-[700] text-[1.6rem]  bg-clip-text text-transparent cursor-pointer">FlexiBoard</h2>
          <div className="flex  flex-row gap-[10px]">
            <button className=" px-[20px] py-[10px] bg-[#eef8ff] text-[#4aa3fa] text-[1rem] font-[600] hover:text-white hover:bg-[#4aa3fa] rounded-[8px]">Job Boards</button>
            <button className="px-[20px] py-[10px] bg-[#eef8ff] text-[#4aa3fa] text-[1rem] font-[600] hover:text-white hover:bg-[#4aa3fa] rounded-[8px]">Create One</button>
            <button className=" px-[20px] py-[10px] bg-[#eef8ff] text-[#4aa3fa] text-[1rem] font-[600] hover:text-white hover:bg-[#4aa3fa] rounded-[8px]">Login</button>
          </div>

        </div>
      </div>
  )
}

export default Navbar
