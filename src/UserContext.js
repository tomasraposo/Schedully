import React,{useContext, useState} from 'react';

//--------------DEFINING CONTEXTS---------------

//context for the getting users token
const TokenContext = React.createContext();
//context for setting users token
const SetTokenContext = React.createContext()

//context for getting the users ID
const UserIDContext = React.createContext();
//context for setting the user ID
const SetUserIDContext = React.createContext();

//context for getting user type 
const UserTypeContext = React.createContext();
//context for setting the user type
const SetUserTypeContext = React.createContext();


//---------EXPORTING CONTEXTS FOR USE-------------
export function useTokenContext(){
    return useContext(TokenContext);
}

export function useSetTokenContext(){
    return useContext(SetTokenContext);
}

export function useUserIDContext(){
    return useContext(UserIDContext);
}

export function useSetUserIDContext(){
    return useContext(SetUserIDContext);
}

export function useUserTypeContext(){
    return useContext(UserTypeContext);
}

export function useSetUserTypeContext(){
    return useContext(SetUserTypeContext);
}

//Main function
export default function UserContextProvider({children}){
    const [token, setToken] = useState("")
    const [userID, setUserID] = useState("");
    const [userType, setUserType] = useState("");
    return(
        <TokenContext.Provider value={token}>
            <SetTokenContext.Provider value={setToken}>
                <UserIDContext.Provider value={userID}>
                    <SetUserIDContext.Provider value={setUserID}>
                        <UserTypeContext.Provider value={userType}>
                            <SetUserTypeContext.Provider value={setUserType}>
                                {children}
                            </SetUserTypeContext.Provider>
                        </UserTypeContext.Provider>
                    </SetUserIDContext.Provider>
                </UserIDContext.Provider>
            </SetTokenContext.Provider>
        </TokenContext.Provider>
    )
}