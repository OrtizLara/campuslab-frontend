import { createContext, useContext, useEffect, useState } from 'react';
import { api, clearSession, getAccessToken, saveSession } from '../services/api';
const Context=createContext(null);
export const useAuth=()=>useContext(Context);
export function AuthProvider({children}) {
  const [user,setUser]=useState(null), [loading,setLoading]=useState(true);
  useEffect(()=>{let live=true;(async()=>{if(getAccessToken()){try{const u=await api.me();if(live)setUser(u);}catch{clearSession();}}if(live)setLoading(false);})();return()=>{live=false;};},[]);
  async function login(email,password,persistent){const tokens=await api.login(email,password);if(!tokens?.access)throw new Error('El backend no devolvió el token de acceso.');saveSession(tokens,persistent);try{const u=await api.me();setUser(u);return u;}catch(e){clearSession();throw e;}}
  function logout(){clearSession();setUser(null);}
  return <Context.Provider value={{user,loading,login,logout}}>{children}</Context.Provider>;
}
