import React,{createContext,useContext,useState}  from 'react'

const DrawerContext=createContext()


export const DrawerProvider = ({children}) => {

    const[leftDrawer,setLeftDrawer]=useState("");
    const[rightDrawer,setRightDrawer]=useState("")

    return (
        <DrawerContext.Provider
         value={{
            leftDrawer,
            setLeftDrawer,
            rightDrawer,
            setRightDrawer
        }}  >
            {children}
        </DrawerContext.Provider>
    )
}


export const useDrawerProvider=()=>{
    return useContext(DrawerContext)
}