import React,{useEffect} from 'react'
import { Switch } from "@/components/ui/switch"
import "../../../app/globals.css"
import { setTimeout } from 'timers/promises'



type Filter2type={
    locationvalue:string,
    locationtype:string[],
    Selectlocationtypes:string[],
    setlocationvalue:(value:string)=>void,
    setSelectlocationtypes:(value:string[])=>void,
    setlocationtype:(value:string[])=>void,
    LocationTypes:string[],
    title:string,
    id1:string,
    id2:string,
    dd1:string,
    dd2:string,
    root:string

}


const Filter2:React.FC<Filter2type> = ({locationtype,setlocationtype,root,Selectlocationtypes,setSelectlocationtypes,locationvalue,setlocationvalue,LocationTypes,title,id1,id2,dd1,dd2}) => {

     useEffect(() => {
         const dropdownDiv = document.getElementById(dd1);
         const dropdownList = document.getElementById(dd2);
     
         if (dropdownDiv && dropdownList) {
           const computedStyles = window.getComputedStyle(dropdownDiv);
           const height = parseFloat(computedStyles.getPropertyValue("height"));
           const diff = height - 42.4;
     
           dropdownList.style.top = `${55 + diff}px`;
         }
       }, [Selectlocationtypes]);

       useEffect(()=>{
       

      
        let items=[...LocationTypes];
        items=items.filter((item)=>(item.toLowerCase().includes(locationvalue.toLowerCase())))
        setlocationtype(items);
  
      },[locationvalue])

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
          let locations=[...locationtype];
          locations=locations.filter((location)=>(location!==loc));
          setlocationtype(locations);
          let newlocations=[...Selectlocationtypes];
          newlocations.push(loc);
          setSelectlocationtypes(newlocations);
          setlocationvalue("")
    
    
        }
        const clearhandler=(loc:string,e:React.MouseEvent<HTMLDivElement>)=>{
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


          let newlocations=[...Selectlocationtypes];
          newlocations=newlocations.filter((location)=>(location!==loc));
          setSelectlocationtypes(newlocations);
          console.log("len :"+Selectlocationtypes.length)
         
          let locations=[...locationtype];
          locations.push(loc);
          locations.sort();
          setlocationtype(locations);
    
        }
        
        const handlelocationback=(e:React.KeyboardEvent)=>{
          if(e.key==="Backspace" && Selectlocationtypes.length>0 && locationvalue.length===0){
            let duplicate=[...Selectlocationtypes];
            let last_ele:any=duplicate.pop();
    
            setSelectlocationtypes(duplicate);   
            let locations=[...locationtype];
    
            if(!locations.includes(last_ele)){
            locations.push(last_ele);
            locations.sort();
            setlocationtype(locations);
            }
    
    
          }
    
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

  return (
    <div className={`${root} filter   relative`} data-closed="false">
    <div id={dd1} onClick={(e)=>{changehandler(id1,id2)}}  className=' border  relative flex items-center gap-[5px]  border-[1px] border-[#C8C8C8] px-[15px] py-[8px] rounded-[8px] hover:border-[#3a90ff]'>
      <div id={id1} className="w-[200px]  text-black-500 text-[1.2rem]">{title}</div>
      <div className='options-list flex  gap-[10px] flex-wrap max-w-[600px]'>
    {Selectlocationtypes.map((loc,index)=>(
      <div className='bg-[#F0F1FA]  h-auto flex items-center gap-[5px]  px-[5px] py-[5px] rounded-[5px]' key={index}>
        <div className='pl-[5px] py-[3px] line-height: normal font-roboto text-[900] text-[1.2rem]'>{loc }</div>
     <div className='wrongbutton  py-[3px] w-[24px] h-[24px] flex items-center line-height:none  font-lato text-[1.1rem] h-auto text-[900] px-[5px]' onClick={(e)=>{clearhandler(loc,e);}}> 
    x</div></div>
    ))}
        <input id={id2} value={locationvalue}  onKeyDown={handlelocationback}  onChange={(e)=>{setlocationvalue(e.target.value)}}  className="hidden w-[200px] text-black-500 text-[1.2rem] " placeholder="Type..."></input>

    </div>

  
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z"/></svg>
    <div  id={dd2} className='drop-down-list   hidden bg-white flex flex-col w-[300px] max-h-[300px] overflow-y-auto rounded-[4px] left-0  top-[55px] absolute shadow-custom' style={{zIndex:9999}}>
   <div className='switch-container text-[1.2rem]    p-[5px] '>
    <div className='switch-cont flex gap-[10px] p-[3px] justify-center items-center border-[1px] border-[#C8C8C8] rounded-[5px]'>
       <Switch /><div>Include Remote</div>
       </div>
   </div>

      {
        locationtype.map((location,index)=>(
          <div onClick={(e)=>{setlocationhandler(location,e)}} key={index+"loc"} className='p-[5px]  hover:bg-[#4aa3fa] hover:text-white cursor-pointer  text-[1.2rem] text-[600]'>
            <div className='drop-down-list-val w-auto px-[15px]'>{location}</div></div>
        ))
      }
    </div>
    </div>
    </div>
  )
}

export default Filter2
