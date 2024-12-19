import Image from 'next/image';
import React,{useState,useEffect,useRef} from 'react'
import "../../app/globals.css";
import {LocationTypes} from "../../FiltersList/Locationtypes"
import { Industries,industriesSubcategories } from '@/FiltersList/CategoryFilter';

import Filter1 from '../DiffFilters/Addablefilter/Filter1';
import Filter2 from '../DiffFilters/dropdownfilter/Filter2';
import { jobCategories } from '../../FiltersList/Jobcategories';
import { DualRangeSlider } from '../DualRangeslider/Dualrange';
import { Switch } from "@/components/ui/switch"
import { SingleSlider } from '../Singleslider/Singleslider';
import {EmploymentList} from "../../FiltersList/Employmentlist"
import Industryfilter from '../DiffFilters/Industry_filter/Industryfilter';
import { countryData } from '@/FiltersList/Locations';
import Locationfilter from '../DiffFilters/Location_filter/Locationfilter';


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
  },
  {
    name:"Experience",
    root:"filter-6",
    Namediv:"",
    Nameinput:"",
    DropDown:"experience-drop-down",
  },
  {
    name:"Employment-type",
    root:"filter-7",
    Namediv:"EmploymenttypeDiv",
    Nameinput:"EmploymenttypeInput",
    DropDown:"EmploymentTypeList",
  },
  {
    name:"Industry",
    root:"filter-8",
    Namediv:"IndustryDiv",
    Nameinput:"IndustryInput",
    DropDown:"Drop-down-Industry"
   
  },
 
  {
    name:"Location",
    root:"filter-9",
    Namediv:"LocationsearchDiv",
    Nameinput:"LocationsearchInput",
    DropDown:"LocationsearchDropdown"
  }
 

  
  
]

type Locationtype={
  country:string,
  emoji:string,
  index:number
}





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
   const [Experiencevalue,setExperiencevalue]=useState<number[]>([0,4]);
   const [Experienceprevalue,setExperienceprevalue]=useState("0  -  4 years");
   const [Employmenttypevalue,setEmploymenttypevalue]=useState<string>("");
   const [EmpTypedropdown,setEmpTypedropdown]=useState<string[]>(EmploymentList);
   const [selectedEmptype,setselectedEmptype]=useState<string[]>([]);
   const [IndustryDropDown,setIndustryDropDown]=useState<string[]>(Industries);
   const [IndustrySubcategory,setIndustrySubcategory]=useState<string[]>([])
   const [SelectedIndustries,setSelectedIndustries]=useState<string[]>([]);
   const [CurrentIndustryVal,setCurrentIndustryVal]=useState<string>("")

   const [dropdowncategory,setdropdowncategory]=useState<string[]>(jobCategories);
   const [Selectjobcategory,setSelectjobcategory]=useState<string[]>([]);
   const [activeDropdown,setactiveDropdown]=useState<string | null>(null);

   const [Locationdropdown,setLocationdropdown]=useState<Locationtype[]>(countryData.slice(0,7));
   const [Locationvalue,setLocationvalue]=useState<string>("");
   const [SelectedLocations,setSelectedLocations]=useState<Locationtype[]>([]);

   
    useEffect(()=>{
       console.log(Locationdropdown)
    },[Locationdropdown])


  useEffect(()=>{
    let jobtitlediv;
      let jobtitleinput; 
      
      const con = [
        { content: jobtitle }, // Spread jobtitle into an array if it's iterable
        { content: Selectlocationtypes },
        { content: Selectjobcategory },
        { content: null },
        { content: null },
        {content:null},
        {content:selectedEmptype},
        {content:SelectedIndustries},
        {content:SelectedLocations}
      ];
      
      Dropdowndata.forEach((data,idx)=>{
        console.log("values");
        console.log(con);
        console.log(idx);
  
          if(activeDropdown!==data.root && con[idx].content!==null && Array.isArray(con[idx].content)  && con[idx].content.length===0){
            console.log(data.root+" accessed ");
                   jobtitlediv=document.getElementById(data.Namediv);
                   jobtitleinput=document.getElementById(data.Nameinput);
                   if(jobtitlediv?.classList.contains("hidden") && jobtitleinput){
                         jobtitleinput.classList.add("hidden");
                        jobtitlediv.classList.remove("hidden");
                     }
  
          }
      })
  },[activeDropdown])

  useEffect(()=>{
     setExperienceprevalue(`${Experiencevalue[0]}  -  ${Experiencevalue[1]} years`)
  },[Experiencevalue])

 



   

   const handleClick=(e:MouseEvent)=>{
       console.log("clicked");
      
       
       let jobtitlediv=document.getElementById("jobtitlediv");
       let jobtitleinput=document.getElementById("jobtitleinput");
      let filter1=document.querySelector(".filter-1") as HTMLElement;
      let filter2=document.querySelector(".filter-2") as HTMLElement;
      let filter3=document.querySelector(".filter-3") as HTMLElement;
      let filter4=document.querySelector(".filter-4") as HTMLElement;
      let filter5=document.querySelector(".filter-5") as HTMLElement;
      let filter6=document.querySelector(".filter-6") as HTMLElement;
      let filter7=document.querySelector(".filter-7") as HTMLElement;
      let filter8=document.querySelector(".filter-8") as HTMLElement;
      let filter9=document.querySelector(".filter-9") as HTMLElement;



      if(e.target && !(filter8?.contains(e.target as HTMLElement)) || !(filter8?.dataset?.closed==="true")){
        setIndustrySubcategory([]);
         }
      
       if(e.target && filter1?.contains(e.target as HTMLElement) || filter1?.dataset?.closed==="true"){
              return;

       }
      else if(e.target && filter2?.contains(e.target as HTMLElement) ||  filter2?.dataset?.closed==="true"){
       return;

       }
     else  if(e.target && filter3?.contains(e.target as HTMLElement) || filter3?.dataset?.closed==="true"){
       return;
       }
     else  if(e.target && filter4?.contains(e.target as HTMLElement) || filter4?.dataset?.closed==="true"){
       
       return;
       }
     else  if(e.target && filter5?.contains(e.target as HTMLElement) || filter5?.dataset?.closed==="true"){
        
       return;
       }
       else  if(e.target && filter6?.contains(e.target as HTMLElement) || filter6?.dataset?.closed==="true"){
        
        return;
        }
        else  if(e.target && filter7?.contains(e.target as HTMLElement) || filter7?.dataset?.closed==="true"){
       
          return;
          }
          else  if(e.target && filter8?.contains(e.target as HTMLElement) || filter8?.dataset?.closed==="true"){
        
            return;
            }
            else  if(e.target && filter9?.contains(e.target as HTMLElement) || filter9?.dataset?.closed==="true"){
        
              return;
              }
       else{
        console.log("clicked outside");
        
        setactiveDropdown(null);
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
    <div className='filters-wrapper relative flex gap-[30px]  flex-wrap justify-center w-[100%]'>
      <Filter1 jobtitle={jobtitle} jobvalue={jobvalue} setjobtitle={setjobtitle}   activeDropdown={activeDropdown}  setactiveDropdown={setactiveDropdown} setjobvalue={setjobvalue} title="Job Title"/>
     <Filter2 
      locationvalue={locationvalue}
      setlocationvalue={setlocationvalue}
      locationtype={locationtype}
      setlocationtype={setlocationtype}
      Selectlocationtypes={Selectlocationtypes}
      setSelectlocationtypes={setSelectlocationtypes}
      LocationTypes={LocationTypes}
      activeDropdown={activeDropdown}
        setactiveDropdown={setactiveDropdown}
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
        activeDropdown={activeDropdown}
        setactiveDropdown={setactiveDropdown}
        setSelectlocationtypes={setSelectjobcategory}
        title="Domain"
        id1="domainDiv"
        id2="domainInput"
        dd1="domainDropdown"
        dd2="domainTypeList"
      />
   <div className='filter-4  filter relative' onClick={()=>{setactiveDropdown("filter-4")}} data-closed="false" >
  <div className='border relative flex items-center border-[1px] border-[#C8C8C8] px-[15px] py-[8px] rounded-[8px] hover:border-[#3a90ff]'>
    <div className="w-[200px] text-black-500 text-[1.2rem]">Salary Range</div>
    <svg className="pl-[5px] box-content"  xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000">
      <path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z" />
    </svg>
   { activeDropdown==="filter-4" && <div id="salary-drop-down" className='drop-down-list drop-down-salary  rounded-md flex flex-col gap-[15px] py-[15px] px-[15px] bg-white absolute top-[55px] left-0 w-[350px] shadow-custom' style={{zIndex: 9999}}>

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
    </div>}
  </div>
</div>

    <div className='filter-5 filter relative' onClick={()=>{setactiveDropdown("filter-5")}} data-closed="false" style={{position: 'relative'}}>
      <div className='border relative flex items-center  border-[1px] border-[#C8C8C8] px-[15px] py-[8px] rounded-[8px] hover:border-[#3a90ff]'>
      <div className="w-[200px] text-black-500 text-[1.2rem]">Date Posted</div>
    <svg className="pl-[5px] box-content" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z"/></svg>
   { activeDropdown==="filter-5" && <div id="drop-down-date" className='drop-down-list  rounded-md flex flex-col gap-[15px] py-[20px] px-[15px] rounded-mg bg-white absolute top-[55px] left-0 w-[350px] shadow-custom absolute' style={{ zIndex: 9999}}>

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
 
    </div>}
      </div> 
      
    </div>
    <Industryfilter
        SelectedIndustries={SelectedIndustries}
        setSelectedIndustries={setSelectedIndustries}
        activeDropdown ={activeDropdown}
        setactiveDropdown={setactiveDropdown}
        setIndustrySubcategory={setIndustrySubcategory}
        IndustrySubcategory={IndustrySubcategory}
        CurrentIndustryVal={CurrentIndustryVal}
        setCurrentIndustryVal={setCurrentIndustryVal}
        setIndustryDropDown={setIndustryDropDown}
        IndustryDropDown={IndustryDropDown}
        industriesSubcategories={industriesSubcategories}
        Industries={Industries}
      />
    <div className='filter-6  filter relative' onClick={()=>{setactiveDropdown("filter-6")}} data-closed="false" >
  <div className='border relative flex items-center  border-[1px] border-[#C8C8C8] px-[15px] py-[8px] rounded-[8px] hover:border-[#3a90ff]'>
    <div className="w-[200px] text-black-500 text-[1.2rem]">Experience </div>
    <svg className="pl-[5px] box-content"  xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000">
      <path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z" />
    </svg>
   { activeDropdown==="filter-6" && <div id="experience-drop-down" className='drop-down-list drop-down-experience  rounded-md flex flex-col gap-[15px] py-[15px] px-[15px] bg-white absolute top-[55px] left-0 w-[350px] shadow-custom' style={{zIndex: 9999}}>

      <div  className='DualRangeslider-container flex flex-col gap-[20px]'>
        <div className='salary-desc flex justify-between'>
          <div>Experience</div>
          <div>{Experienceprevalue}</div>
        </div>
        <DualRangeSlider
          min={0}
          max={10}
          value={Experiencevalue}
          onValueChange={setExperiencevalue}
        />

      </div>
      <div className='switch-container text-[1.2rem]'>
        <div className='switch-cont flex gap-[10px] p-[3px] justify-center items-center border-[1px] border-[#C8C8C8] rounded-[5px]'>
          <Switch />
          <div>Include No YEO info</div>
        </div>
      </div>
    </div>}
  </div>
</div>
{/* const [Employmenttypevalue,setEmploymenttypevalue]=useState<string>("");
   const [EmpTypedropdown,setEmpTypedropdown]=useState<string[]>(EmploymentList);
   const [selectedEmptype,setselectedEmptype]=useState<string[]>([]) */}
     <Filter2
        locationvalue={Employmenttypevalue}
        setlocationvalue={setEmploymenttypevalue}
        locationtype={EmpTypedropdown}
        setlocationtype={setEmpTypedropdown}
        Selectlocationtypes={selectedEmptype}
        LocationTypes={EmploymentList}
        root="filter-7"
        activeDropdown={activeDropdown}
        setactiveDropdown={setactiveDropdown}
        setSelectlocationtypes={setselectedEmptype}
        title="Employment-type"
        id1="EmploymenttypeDiv"
        id2="EmploymenttypeInput"
        dd1="EmploymenttypeDropdown"
        dd2="EmploymentTypeList"
      />
      
   {/* const [Locationdropdown,setLocationdropdown]=useState<Locationtype[]>(countryData.slice(0,7));
   const [Locationvalue,setLocationvalue]=useState<string>("");
   const [SelectedLocations,setSelectedLocations]=useState<Locationtype[]>([]); */}
     <Locationfilter
        locationvalue={Locationvalue}
        setlocationvalue={setLocationvalue}
        locationtype={Locationdropdown}
        setlocationtype={setLocationdropdown}
        Selectlocationtypes={SelectedLocations}
        LocationTypes={countryData}
        root="filter-9"
        activeDropdown={activeDropdown}
        setactiveDropdown={setactiveDropdown}
        setSelectlocationtypes={setSelectedLocations}
        title="Location"
        id1="LocationsearchDiv"
        id2="LocationsearchInput"
        dd1="LocationsearchDropdown"
        dd2="LocationsearchList"
      />
      {
        /* id1:IndustryTitle
        id2:IndustryInput
        dd1:IndustryDiv
        dd2:Drop-down-Industry
        */
      }
      
      
    </div>
    
  )
}

export default Filter
