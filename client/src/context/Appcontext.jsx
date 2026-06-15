import { createContext } from "react";
export const Appcontext=createContext()
export const Appcontextprovider=(props)=>{
    const value={
        
    }
    return (
        <Appcontext.Provider value={value}>
            {props.children}
        </Appcontext.Provider>
    )
}