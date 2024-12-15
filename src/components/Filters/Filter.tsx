import Image from 'next/image';
import React,{useState,useEffect} from 'react'
import "../../app/globals.css";
import {LocationTypes} from "../../FiltersList/Locationtypes"

import Filter1 from '../DiffFilters/Addablefilter/Filter1';
import Filter2 from '../DiffFilters/dropdownfilter/Filter2';
import { jobCategories } from '../../FiltersList/Jobcategories';



const Filter = () => {
   const [jobtitle,setjobtitle]=useState<string[]>([]); //added options for jobtitle (addable filter)
   const [jobvalue,setjobvalue]=useState<string>("");//current typed value of the filter (addable filter)
   const [locationvalue,setlocationvalue]=useState<string>(""); // current typed value of the filter (dropdown filter)
   const [locationtype,setlocationtype]=useState<string[]>(LocationTypes); //drop down values (dropdown filter)
   const [Selectlocationtypes,setSelectlocationtypes]=useState<string[]>([]); //selected values from the dropdown (dropdown filter)
   const [searchjobcategory,setsearchjobcategory]=useState<string>("");
   const [dropdowncategory,setdropdowncategory]=useState<string[]>(jobCategories);
   const [Selectjobcategory,setSelectjobcategory]=useState<string[]>([]);

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
      
    
      
    </div>
  )
}

export default Filter
