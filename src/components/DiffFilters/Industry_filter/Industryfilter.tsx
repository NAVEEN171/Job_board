import { Industries,industriesSubcategories } from '@/FiltersList/CategoryFilter';
import type { Subcategorytype } from '@/FiltersList/CategoryFilter';
import React,{useEffect} from 'react'

type stringfunc=(val:string[])=>void;

type IndustryFilterType={
    SelectedIndustries:string[],
    setSelectedIndustries:stringfunc,
    activeDropdown:string|null,
    setactiveDropdown:(val:string)=>void,
    setIndustrySubcategory:stringfunc,
    IndustrySubcategory:string[],
    CurrentIndustryVal:string,
    setCurrentIndustryVal:(val:string)=>void,
    setIndustryDropDown:stringfunc,
    IndustryDropDown:string[],
    industriesSubcategories:Subcategorytype
    Industries:string[]



}
const Industryfilter:React.FC<IndustryFilterType> = ({SelectedIndustries,activeDropdown,setactiveDropdown,setSelectedIndustries,setIndustrySubcategory,IndustrySubcategory,CurrentIndustryVal,setCurrentIndustryVal,setIndustryDropDown,IndustryDropDown,industriesSubcategories,Industries}) => {
    
   
    
      useEffect(()=>{
      

     
       let items=[...Industries];
       items=items.filter((item)=>(item.toLowerCase().includes(CurrentIndustryVal.toLowerCase())))
       setIndustryDropDown(items);
 
     },[CurrentIndustryVal])
      

    const setlocationhandler=(loc:string,e:React.MouseEvent<HTMLDivElement>)=>{
      let clickedelement = e.target as HTMLElement | null; // Ensure it's cast safely
        let closestFilter: HTMLElement | null = null; // Initialize to null explicitly

      if (clickedelement) {
       closestFilter = clickedelement.closest(".filter") as HTMLElement | null;
           }

         if (closestFilter) {
             closestFilter.setAttribute("data-closed", "true");
        }
        window.setTimeout(() => {
          if (closestFilter) {
            closestFilter.setAttribute("data-closed", "false");
            }
          }, 200);
         
         let newlocations=[...SelectedIndustries];
         let changedstr=loc.replace(/\(Select All\)/g, '').trim()
         if(newlocations.includes(changedstr)){
            return;
         }
         newlocations.push(changedstr);
         setSelectedIndustries(newlocations);
         setCurrentIndustryVal("")
   
   
       }

       //  const [IndustryDropDown,setIndustryDropDown]=useState<string[]>(Industries);
     //  const [IndustrySubcategory,setIndustrySubcategory]=useState<string[]>([])
     //  const [SelectedIndustries,setSelectedIndustries]=useState<string[]>([]);
     //  const [CurrentIndustryVal,setCurrentIndustryVal]=useState<string>("")

       const clearhandler=(loc:string,e:React.MouseEvent<HTMLDivElement>)=>{
         let clickedelement = e.target as HTMLElement | null; // Ensure it's cast safely
         let closestFilter: HTMLElement | null = null; // Initialize to null explicitly

      if (clickedelement) {
         closestFilter = clickedelement.closest(".filter") as HTMLElement | null;
       }

     if (closestFilter) {
         closestFilter.setAttribute("data-closed", "true");
       }
      setTimeout(() => {
         if (closestFilter) {
        closestFilter.setAttribute("data-closed", "false");
         }
    }, 200);


         let newlocations=[...SelectedIndustries];
         newlocations=newlocations.filter((location)=>(location!==loc));
         setSelectedIndustries(newlocations);
         console.log("len :"+SelectedIndustries.length)
        
         let locations=[...IndustryDropDown];
         locations.push(loc);
         locations.sort();
         setIndustryDropDown(locations);
   
       }

const changehandler=(ID1:string,ID2:string)=>{
     
 let Jobtitlediv :HTMLElement=document.getElementById(ID1)!;
 let jobinput:HTMLElement=document.getElementById(ID2)!;
 if(Jobtitlediv && jobinput){
 Jobtitlediv.classList.add("hidden")
 jobinput.classList.remove("hidden")
 jobinput.focus();
 }
 
}


const handlelocationback=(e:React.KeyboardEvent)=>{

       if(e.key==="Backspace" && SelectedIndustries.length>0 && CurrentIndustryVal.length===0){
         let duplicate=[...SelectedIndustries];
         let last_ele:any=duplicate.pop();
 
         setSelectedIndustries(duplicate);   
         
 
 
       }
 
     }
  return (
    <div className={`filter-8 filter   relative max-w-[90%]`} onClick={()=>{setactiveDropdown("filter-8")}} data-closed="false">
          <div id="IndustryTitle" onClick={(e)=>{changehandler("IndustryDiv","IndustryInput")}}  className=' border   relative flex items-center justify-between  border-[1px] border-[#C8C8C8] px-[15px] py-[8px] rounded-[8px] hover:border-[#3a90ff]'>
            <div id="IndustryDiv" className="w-[200px]  text-black-500 text-[1.2rem]">Industry</div>
            <div className='options-list flex   gap-[10px] flex-wrap max-w-[85%]'>
          {SelectedIndustries.map((loc,index)=>(
            <div className='bg-[#F0F1FA]  h-auto flex items-center gap-[5px]  px-[5px] py-[5px] rounded-[5px]' key={index}>
              <div className='pl-[5px] py-[3px] line-height: normal font-roboto text-[900] text-[1.2rem]'>{loc }</div>
           <div className='wrongbutton  py-[3px] w-[24px] h-[24px] flex items-center line-height:none  font-lato text-[1.1rem] h-auto text-[900] px-[5px]' onClick={(e)=>{clearhandler(loc,e);}}> 
          x</div></div>
          ))}
              <input id="IndustryInput" value={CurrentIndustryVal}  onKeyDown={handlelocationback}  onChange={(e)=>{setCurrentIndustryVal(e.target.value)}}  className="hidden w-[200px] text-black-500 text-[1.2rem] " placeholder="Type..."></input>
      
          </div>
      
        
          <svg className='pl-[5px] box-content' xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z"/></svg>
         {activeDropdown==="filter-8" &&( <div id="Drop-down-Industry-main" className='Industries-DropdownContainer left-0  top-full translate-y-4  absolute flex' style={{zIndex:9999}}>
          <div   className='drop-down-list    bg-white flex flex-col w-[300px] max-h-[300px] overflow-y-auto rounded-[4px]  shadow-custom'>
        
      
            {
              IndustryDropDown.map((location,index)=>(
                <div onMouseEnter={()=>{setIndustrySubcategory(industriesSubcategories[location])}} onClick={(e)=>{setlocationhandler(location,e)}} key={index+"loc"} className='p-[5px]  hover:bg-[#4aa3fa] hover:text-white cursor-pointer  text-[1.2rem] text-[600]'>
                  <div className='drop-down-list-val w-auto px-[15px]'>{location}</div></div>
              ))
            }
          </div>
         {(IndustrySubcategory.length>0) && <div  id="Drop-down-Industry" onMouseLeave={()=>{setIndustrySubcategory([])}} className='drop-down-list    bg-white flex flex-col w-[300px] max-h-[300px] overflow-y-auto rounded-[4px]  shadow-custom' >
        
      
            {
              IndustrySubcategory.map((location,index)=>(
                <div  onClick={(e)=>{setlocationhandler(location,e)}} key={index+"loc"} className='p-[5px]  hover:bg-[#4aa3fa] hover:text-white cursor-pointer  text-[1.2rem] text-[600]'>
                  <div className='drop-down-list-val w-auto px-[15px]'>{location}</div></div>
              ))
            }
          </div>}
          </div>)}
          </div>
          </div>
  )
}

export default Industryfilter
