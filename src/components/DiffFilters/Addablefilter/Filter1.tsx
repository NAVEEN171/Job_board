import React from 'react'
import "../../../app/globals.css"

type Filter1type={
    jobtitle:string[],
    jobvalue:string,
    setjobvalue:(value:string)=>void
    setjobtitle:(value:string[])=>void,
    title:string
}

const Filter1:React.FC<Filter1type> = ({jobtitle,jobvalue,setjobvalue,setjobtitle,title}) => {
    
        const changehandler=(ID1:string,ID2:string)=>{
            let Jobtitlediv :HTMLElement=document.getElementById(ID1)!;
            let jobinput:HTMLElement=document.getElementById(ID2)!;
            if(Jobtitlediv && jobinput){
            Jobtitlediv.classList.add("hidden")
            jobinput.classList.remove("hidden")
            jobinput.focus();
            }
            
        }
        const clickHandler=(job:string)=>{
            console.log(job);
                  let jobtitle_duplicate=[...jobtitle];
                  jobtitle_duplicate=jobtitle_duplicate.filter((jobs)=>{
                  
                    return jobs!==job;
                  });
                  setjobtitle(jobtitle_duplicate);
                  
          }
        const handlepress=(e:React.KeyboardEvent)=>{
          if(e.key==="Enter" && jobvalue.trim()!==""){
            setjobtitle([...jobtitle,jobvalue]);
            setjobvalue("");
          }
          else if(e.key==="Backspace" && jobtitle.length!==0 && jobvalue.length==0){
              let duplicate=jobtitle.slice(0,-1);
              setjobtitle(duplicate);
    
    
          }
    
        }
  return (
    <div className='filter-1 filter  relative' data-closed="false">
    <div  onClick={()=>{changehandler("jobtitlediv","jobtitleinput")}} className="drop-down z-10  border border-[1px] border-[#C8C8C8] px-[15px] py-[8px] rounded-[8px] hover:border-[#3a90ff]">
      <div className='options-list-2 flex  gap-[10px] flex-wrap max-w-screen-sm	'>
      {jobtitle.map((job,index)=>(
        <div className='bg-[#F0F1FA]  h-auto flex items-center gap-[5px]  px-[5px] py-[5px] rounded-[5px]' key={index}>
          <div className='pl-[5px] py-[3px] line-height: normal font-roboto text-[900] text-[1.2rem]'>{job }</div>
       <div className='wrongbutton  py-[3px] flex items-center line-height:normal  font-lato text-[1.1rem] h-auto text-[900] px-[5px]' onClick={()=>clickHandler(job)}> 
      x</div></div>
      ))}
      </div>

        <div id="jobtitlediv" className="type w-[200px]  text-black-500 text-[1.2rem]">{title}</div>
      <input id="jobtitleinput" value={jobvalue} onKeyDown={handlepress} onChange={(e)=>{setjobvalue(e.target.value)}}  className="hidden w-[200px] text-black-500 text-[1.2rem] " placeholder="Type..."></input>
      </div>
      </div>
  )
}

export default Filter1
