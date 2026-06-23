import { createContext, useEffect, useState } from "react";
import { dummyCourses } from "../assets/assets";
import { useNavigate } from "react-router-dom";
export const Appcontext=createContext()
export const Appcontextprovider=(props)=>{
    const currency = import.meta.env.VITE_CURRENCY
    const [allcourses,setallcourses]=useState([])
    const [iseducator, seteducator] = useState(true);
    const fetchallcouses= async ()=>{
        setallcourses(dummyCourses)
    }

    const navigate = useNavigate()
    const calculaterating =(course)=>{
        if(course.courseRatings.length===0){
            return 0;
        }
        let totalrating =0
        course.courseRatings.forEach(rating=>{
            totalrating+=rating.rating
        })
        return totalrating / course.courseRatings.length;

    }
    const value={
        currency,allcourses,navigate,calculaterating,iseducator,seteducator
    }
    useEffect(()=>{
        fetchallcouses()
    },[])
    return (
        <Appcontext.Provider value={value}>
            {props.children}
        </Appcontext.Provider>
    )
}