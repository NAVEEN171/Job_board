import Image from 'next/image';
import React,{useState,useEffect,useRef} from 'react'
import "../../app/globals.css";
import {LocationTypes} from "../../FiltersList/Locationtypes"

import Filter1 from '../DiffFilters/Addablefilter/Filter1';
import Filter2 from '../DiffFilters/dropdownfilter/Filter2';
import { jobCategories } from '../../FiltersList/Jobcategories';
import { DualRangeSlider } from '../DualRangeslider/Dualrange';
import { Switch } from "@/components/ui/switch"
import { SingleSlider } from '../Singleslider/Singleslider';

type DropDowndatatype={
  name:string,
  root:string,
  Namediv:string,
  Nameinput:string,
  DropDown:string,
  content?:any,

}


const Dropdowndata:DropDowndatatype[]=[
  {
    name:"Jobtitle",
    root:"filter-1",
    Namediv:"jobtitlediv",
    Nameinput:"jobtitleinput",
    DropDown:"",
  },
  {
    name:"Location Type",
    root:"filter-2",
    Namediv:"locdiv",
    Nameinput:"locationinput",
    DropDown:"locationtypelist",
  },
  {
    name:"Domain",
    root:"filter-3",
    Namediv:"domainDiv",
    Nameinput:"domainInput",
    DropDown:"domainTypeList",
  },
  {
    name:"Salary",
    root:"filter-4",
    Namediv:"",
    Nameinput:"",
    DropDown:"salary-drop-down",
  },
  {
    name:"Date",
    root:"filter-5",
    Namediv:"",
    Nameinput:"",
    DropDown:"drop-down-date",
  }

  
  
]





const Filter = () => {
   const [jobtitle,setjobtitle]=useState<string[]>([]); //added options for jobtitle (addable filter)
   const [jobvalue,setjobvalue]=useState<string>("");//current typed value of the filter (addable filter)
   const [locationvalue,setlocationvalue]=useState<string>(""); // current typed value of the filter (dropdown filter)
   const [locationtype,setlocationtype]=useState<string[]>(LocationTypes); //drop down values (dropdown filter)
   const [Selectlocationtypes,setSelectlocationtypes]=useState<string[]>([]); //selected values from the dropdown (dropdown filter)
   const [searchjobcategory,setsearchjobcategory]=useState<string>("");
   const [sliderValue, setSliderValue] = useState<number[]>([40, 900]);
   const [Slideprevalue,setSlideprevalue]=useState("40K  -  900K");
   const [singleSlidervalue,setsingleSlidervalue]=useState<number[]>([7]);
   const [datepostedshower,setdatepostedshower]=useState<string>("7 days ago");

   const [dropdowncategory,setdropdowncategory]=useState<string[]>(jobCategories);
   const [Selectjobcategory,setSelectjobcategory]=useState<string[]>([]);
   const jobtitleRef = useRef(jobtitle);
   const SelectlocationtypesRef=useRef(Selectlocationtypes);
   const SelectjobcategoryRef=useRef(Selectjobcategory);

   useEffect(()=>{
   jobtitleRef.current=jobtitle;
   },[jobtitle]
  )

  useEffect(()=>{
    SelectlocationtypesRef.current=Selectlocationtypes;
    },[Selectlocationtypes]
   )

   useEffect(()=>{
    SelectjobcategoryRef.current=Selectjobcategory;
    },[Selectjobcategory]
   )

   const dropdownopen=(idx:number)=>{
     let dropdowncontainer=document.getElementById(Dropdowndata[idx]?.DropDown);
    
     if(dropdowncontainer?.classList.contains("hidden")){
      dropdowncontainer.classList.remove("hidden");
    }

   }

   const titleopen=(name:string)=>{
    let jobtitlediv;
    let jobtitleinput; 
    
    const con = [
      { content: jobtitleRef }, // Spread jobtitle into an array if it's iterable
      { content: SelectlocationtypesRef },
      { content: SelectjobcategoryRef },
      { content: null },
      { content: null }
    ];
    
    Dropdowndata.forEach((data,idx)=>{
      console.log("values");
      console.log(con);
      console.log(idx);

        if(name!==data.root && con[idx].content!==null && Array.isArray(con[idx].content?.current)  && con[idx].content.current.length===0){
          console.log(data.root+" accessed ");
                 jobtitlediv=document.getElementById(data.Namediv);
                 jobtitleinput=document.getElementById(data.Nameinput);
                 if(jobtitlediv?.classList.contains("hidden") && jobtitleinput){
                       jobtitleinput.classList.add("hidden");
                      jobtitlediv.classList.remove("hidden");
                   }

        }
    })
   }

   const hideotherdropdowns=(val:string)=>{
    let hidedropdown;
    Dropdowndata.forEach((data)=>{
         if(val!==data.root && data.DropDown!==""){
          hidedropdown=document.getElementById(data.DropDown);
          if(!(hidedropdown?.classList.contains("hidden")) && hidedropdown){
              hidedropdown.classList.add("hidden");
          }
         }

    })
         
   }



   

   const handleClick=(e:MouseEvent)=>{
       console.log("clicked");
      
       
       let jobtitlediv=document.getElementById("jobtitlediv");
       let jobtitleinput=document.getElementById("jobtitleinput");
      let filter1=document.querySelector(".filter-1") as HTMLElement;
      let filter2=document.querySelector(".filter-2") as HTMLElement;
      let filter3=document.querySelector(".filter-3") as HTMLElement;
      let filter4=document.querySelector(".filter-4") as HTMLElement;
      let filter5=document.querySelector(".filter-5") as HTMLElement;
      console.log(e.target);
      console.log(jobtitleRef.current);
      console.log(e.clientX,e.clientY);
       if(e.target && filter1?.contains(e.target as HTMLElement) || filter1?.dataset?.closed==="true" ){
        console.log("clicked on filter-1");
        hideotherdropdowns("filter-1");
        titleopen("filter-1");
       



       }
      else if(e.target && filter2?.contains(e.target as HTMLElement) || filter2?.dataset?.closed==="true"){
        console.log("clicked on filter-2");
        dropdownopen(1);
        hideotherdropdowns("filter-2");
        titleopen("filter-2");

        

       }
     else  if(e.target && filter3?.contains(e.target as HTMLElement) || filter3?.dataset?.closed==="true"){
        console.log("clicked on filter-3");
        dropdownopen(2);
        hideotherdropdowns("filter-3");
        titleopen("filter-3");


       }
     else  if(e.target && filter4?.contains(e.target as HTMLElement) || filter4?.dataset?.closed==="true"){
        console.log("clicked on filter-4");
        dropdownopen(3);
        hideotherdropdowns("filter-4");
        titleopen("filter-4");


       }
     else  if(e.target && filter5?.contains(e.target as HTMLElement) || filter5?.dataset?.closed==="true"){
        console.log("clicked on filter-5");
        dropdownopen(4);
        hideotherdropdowns("filter-5");
        titleopen("filter-5");


       }
       else{
        console.log("clicked outside");
        hideotherdropdowns("none");
        titleopen("none");
       }
       
       
   }

   useEffect(()=>{
      document.addEventListener('click',handleClick);
      return () => {
        document.removeEventListener('click', handleClick);
      };
   },[])

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

     const handleSingleValueChange = (value:number[]) => {
      setsingleSlidervalue(value);
      setdatepostedshower(value+" days ago ")
    };
   
  return (
    <div className='filters-wrapper relative flex gap-[30px] flex-wrap w-[80%]'>
      <Filter1 jobtitle={jobtitle} jobvalue={jobvalue} setjobtitle={setjobtitle} setjobvalue={setjobvalue} title="Job Title"/>
     <Filter2 
      locationvalue={locationvalue}
      setlocationvalue={setlocationvalue}
      locationtype={locationtype}
      setlocationtype={setlocationtype}
      Selectlocationtypes={Selectlocationtypes}
      setSelectlocationtypes={setSelectlocationtypes}
      LocationTypes={LocationTypes}
      root="filter-2"
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
        root="filter-3"

        setSelectlocationtypes={setSelectjobcategory}
        title="Domain"
        id1="domainDiv"
        id2="domainInput"
        dd1="domainDropdown"
        dd2="domainTypeList"
      />
   <div className='filter-4 filter relative' data-closed="false" >
  <div className='border relative flex items-center gap-[5px] border-[1px] border-[#C8C8C8] px-[15px] py-[8px] rounded-[8px] hover:border-[#3a90ff]'>
    <div className="w-[200px] text-black-500 text-[1.2rem]">Salary Range</div>
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000">
      <path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z" />
    </svg>
    <div id="salary-drop-down" className='drop-down-list drop-down-salary hidden rounded-md flex flex-col gap-[15px] py-[15px] px-[15px] bg-white absolute top-[55px] left-0 w-[350px] shadow-custom' style={{zIndex: 9999}}>

      <div className='DualRangeslider-container flex flex-col gap-[20px]'>
        <div className='salary-desc flex justify-between'>
          <div>salary</div>
          <div>{Slideprevalue}</div>
        </div>
        <DualRangeSlider
          min={0}
          max={1190}
          value={sliderValue}
          onValueChange={setSliderValue}
        />

      </div>
      <div className='switch-container text-[1.2rem]'>
        <div className='switch-cont flex gap-[10px] p-[3px] justify-center items-center border-[1px] border-[#C8C8C8] rounded-[5px]'>
          <Switch />
          <div>Include No salary Info</div>
        </div>
      </div>
    </div>
  </div>
</div>

    <div className='filter-5 filter relative' data-closed="false" style={{position: 'relative'}}>
      <div className='border relative flex items-center gap-[5px] border-[1px] border-[#C8C8C8] px-[15px] py-[8px] rounded-[8px] hover:border-[#3a90ff]'>
      <div className="w-[200px] text-black-500 text-[1.2rem]">Date Posted</div>
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z"/></svg>
    <div id="drop-down-date" className='drop-down-list hidden rounded-md flex flex-col gap-[15px] py-[20px] px-[15px] rounded-mg bg-white absolute top-[55px] left-0 w-[350px] shadow-custom absolute' style={{ zIndex: 9999}}>

<div className='Singleslider-container flex flex-col gap-[20px]'>
  <div className='salary-desc flex justify-between'>
    <div className=''>Date Posted</div>
    <div>{datepostedshower}</div>
  </div>
  <SingleSlider
                value={singleSlidervalue}
                onValueChange={handleSingleValueChange}
                min={0}
                max={90}
                step={1}
              
    />
   

  </div>
 
    </div>
      </div>
    </div>
    </div>
  )
}

export default Filter
