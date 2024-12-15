import Image from 'next/image';
import React,{useState,useEffect} from 'react'
import "../../app/globals.css";
import {LocationTypes} from "../../FiltersList/Locationtypes"

import Filter1 from '../DiffFilters/Addablefilter/Filter1';
import Filter2 from '../DiffFilters/dropdownfilter/Filter2';
import { jobCategories } from '../../FiltersList/Jobcategories';
import { DualRangeSlider } from '../DualRangeslider/Dualrange';
import { Switch } from "@/components/ui/switch"




const Filter = () => {
   const [jobtitle,setjobtitle]=useState<string[]>([]); //added options for jobtitle (addable filter)
   const [jobvalue,setjobvalue]=useState<string>("");//current typed value of the filter (addable filter)
   const [locationvalue,setlocationvalue]=useState<string>(""); // current typed value of the filter (dropdown filter)
   const [locationtype,setlocationtype]=useState<string[]>(LocationTypes); //drop down values (dropdown filter)
   const [Selectlocationtypes,setSelectlocationtypes]=useState<string[]>([]); //selected values from the dropdown (dropdown filter)
   const [searchjobcategory,setsearchjobcategory]=useState<string>("");
   const [sliderValue, setSliderValue] = useState<number[]>([0, 1190]);
   const [Slideprevalue,setSlideprevalue]=useState("0K  -  1.19M")

   const [dropdowncategory,setdropdowncategory]=useState<string[]>(jobCategories);
   const [Selectjobcategory,setSelectjobcategory]=useState<string[]>([]);

   useEffect(()=>{
    
    let show1="K";
    let show2="K";
    let num1,num2;
      if(sliderValue[0]>999){
        num1=Math.floor((sliderValue[0]/1000)*100)/100;
        show1="M"
      }
      else{
        num1=sliderValue[0];
        show1="K";
      }
      if(sliderValue[1]>999){
        num2=Math.floor((sliderValue[1]/1000)*100)/100;
        show2="M";

      }
      else{
          num2=sliderValue[1];
          show2="K";
      
      }
      setSlideprevalue(num1+show1+" - "+num2+show2)
      
      
      
     },[sliderValue])
  //  useEffect(() => {
  //   const dropdownDiv = document.getElementById("locationdropdown");
  //   const dropdownList = document.getElementById("locationtypelist");

  //   if (dropdownDiv && dropdownList) {
  //     const computedStyles = window.getComputedStyle(dropdownDiv);
  //     const height = parseFloat(computedStyles.getPropertyValue("height"));
  //     const diff = height - 42.4;

  //     dropdownList.style.top = `${55 + diff}px`;
  //   }
  // }, [Selectlocationtypes]);

    // const changehandler=(ID1:string,ID2:string)=>{
    //     let Jobtitlediv :HTMLElement=document.getElementById(ID1)!;
    //     let jobinput:HTMLElement=document.getElementById(ID2)!;
    //     if(Jobtitlediv && jobinput){
    //     Jobtitlediv.classList.add("hidden")
    //     jobinput.classList.remove("hidden")
    //     jobinput.focus();
    //     }
        
    // }

    // const handlepress=(e:React.KeyboardEvent)=>{
    //   if(e.key==="Enter" && jobvalue.trim()!==""){
    //     setjobtitle([...jobtitle,jobvalue]);
    //     setjobvalue("");
    //   }
    //   else if(e.key==="Backspace" && jobtitle.length!==0 && jobvalue.length==0){
    //       let duplicate=jobtitle.slice(0,-1);
    //       setjobtitle(duplicate);


    //   }

    // }

    // const clickHandler=(job:string)=>{
    //   console.log(job);
    //         let jobtitle_duplicate=[...jobtitle];
    //         jobtitle_duplicate=jobtitle_duplicate.filter((jobs)=>{
            
    //           return jobs!==job;
    //         });
    //         setjobtitle(jobtitle_duplicate);
            
    // }


    // const setlocationhandler=(loc:string)=>{
    //   let locations=[...locationtype];
    //   locations=locations.filter((location)=>(location!==loc));
    //   setlocationtype(locations);
    //   let newlocations=[...Selectlocationtypes];
    //   newlocations.push(loc);
    //   setSelectlocationtypes(newlocations);
    //   console.log("hi");
    //   console.log(jobtitle);
    //   setlocationvalue("")


    // }

    // const clearhandler=(loc:string)=>{
    //   let newlocations=[...Selectlocationtypes];
    //   newlocations=newlocations.filter((location)=>(location!==loc));
    //   setSelectlocationtypes(newlocations);
    //   let locations=[...locationtype];
    //   locations.push(loc);
    //   setlocationtype(locations);

    // }

    // useEffect(()=>{
      
    //   let items=[...LocationTypes];
    //   items=items.filter((item)=>(item.toLowerCase().includes(locationvalue.toLowerCase())))
    //   setlocationtype(items);

    // },[locationvalue])

    // const handlelocationback=(e:React.KeyboardEvent)=>{
    //   if(e.key==="Backspace" && Selectlocationtypes.length>0 && locationvalue.length===0){
    //     let duplicate=[...Selectlocationtypes];
    //     let last_ele:any=duplicate.pop();

    //     setSelectlocationtypes(duplicate);   
    //     let locations=[...locationtype];

    //     if(!locations.includes(last_ele)){
    //     locations.push(last_ele);
    //     setlocationtype(locations);
    //     }


    //   }

    // }
   
  return (
    <div className='filters-wrapper flex gap-[10px] flex-wrap w-[80%]'>
      <Filter1 jobtitle={jobtitle} jobvalue={jobvalue} setjobtitle={setjobtitle} setjobvalue={setjobvalue} title="Job Title"/>
     <Filter2 
      locationvalue={locationvalue}
      setlocationvalue={setlocationvalue}
      locationtype={locationtype}
      setlocationtype={setlocationtype}
      Selectlocationtypes={Selectlocationtypes}
      setSelectlocationtypes={setSelectlocationtypes}
      LocationTypes={LocationTypes}
      title="Location Type"
      id1="locdiv"
      id2="locationinput"
      dd1="locationdropdown"
      dd2="locationtypelist"
      />
      <Filter2
        locationvalue={searchjobcategory}
        setlocationvalue={setsearchjobcategory}
        locationtype={dropdowncategory}
        setlocationtype={setdropdowncategory}
        Selectlocationtypes={Selectjobcategory}
        LocationTypes={jobCategories}

        setSelectlocationtypes={setSelectjobcategory}
        title="Domain"
        id1="domainDiv"
        id2="domainInput"
        dd1="domainDropdown"
        dd2="domainTypeList"
      />
      <div className='filter-3'>
      <div   className='border my-[10px] relative flex items-center gap-[5px]  border-[1px] border-[#C8C8C8] px-[15px] py-[8px] rounded-[8px] hover:border-[#3a90ff]'>
      <div  className="w-[200px]  text-black-500 text-[1.2rem]">Salary Range</div>
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z"/></svg>
    <div className='drop-down-salary rounded-md flex flex-col gap-[15px] py-[10px] px-[15px] rounded-mg bg-white absolute top-[55px] left-0 h-[200px] w-[350px] shadow-custom'>

<div className='DualRangeslider-container flex flex-col gap-[20px] '>
  <div className='salary-desc flex justify-between'>
    <div className=''>salary</div>
    <div>{Slideprevalue}</div>
  </div>
  <DualRangeSlider
    min={0}
    max={1190}
    value={sliderValue}
    onValueChange={setSliderValue}
  />
  </div>
  <div className='switch-container text-[1.2rem]     '>
    <div className='switch-cont flex gap-[10px] p-[3px] justify-center items-center border-[1px] border-[#C8C8C8] rounded-[5px]'>
   <Switch /><div>Include No salary Info</div>
   </div>
   </div>
    </div>
      </div>
    </div>
    </div>
  )
}

export default Filter
