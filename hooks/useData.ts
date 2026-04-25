import { useContext } from "react";
import { DataContext }  from "../context/userContext";
import { StoreDataContext }  from "../context/storeContext";
import { AuthDataContext } from "@/context/authContext";

export const useUserData = () => useContext(DataContext);
export const useAuthData = () => useContext(AuthDataContext);
export const useStoreData = () => useContext(StoreDataContext);

