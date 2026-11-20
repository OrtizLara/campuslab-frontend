import {API_BASE_URL,isDemo} from './config.js';
import {demoList,demoGet,demoSave,demoDelete,demoReview} from './demo.js';
const TOKEN_KEY='campuslab_access';const REFRESH_KEY='campuslab_refresh';
export const getToken=()=>sessionStorage.getItem(TOKEN_KEY)||localStorage.getItem(TOKEN_KEY);
export const isLoggedIn=()=>!!getToken()||isDemo();
export const logout=()=>{sessionStorage.removeItem(TOKEN_KEY);localStorage.removeItem(TOKEN_KEY);sessionStorage.removeItem(REFRESH_KEY);localStorage.removeItem(REFRESH_KEY);localStorage.removeItem('campuslab_user')};
const unpack=(data)=> Array.isArray(data)?data:Array.isArray(data?.results)?data.results:Array.isArray(data?.data)?data.data:Array.isArray(data?.projects)?data.projects:[];
export {unpack};
export async function request(path,{method='GET',body,auth=false,form=false}={}){
 const headers={Accept:'application/json'};if(body&&!form)headers['Content-Type']='application/json';
 const token=getToken();if(auth&&token)headers.Authorization=`Bearer ${token}`;
 let response;
 try{response=await fetch(`${API_BASE_URL}${path}`,{method,headers,body:form?body:body?JSON.stringify(body):undefined})}
 catch{throw Error(`No se pudo conectar con Django (${API_BASE_URL}). Revisá que esté ejecutándose y que CORS permita el origen del frontend.`)}
 if(response.status===204)return null;
 const type=response.headers.get('content-type')||'';
 const data=type.includes('json')?await response.json():await response.text();
 if(!response.ok){const msg=typeof data==='object'?(data.detail||data.message||data.error||Object.entries(data).map(([k,v])=>`${k}: ${Array.isArray(v)?v.join(', '):String(v)}`).join(' · ')):String(data).slice(0,230);throw Error(msg||`Error HTTP ${response.status}`)}
 return data;
}
export async function login(email,password,remember=false){
 if(isDemo()){localStorage.setItem('campuslab_user',JSON.stringify({email,first_name:'Docente',role:'teacher'}));return {demo:true}}
 const result=await request('/api/auth/login',{method:'POST',body:{email,password}});
 const access=result.access||result.access_token||result.tokens?.access||result.token;
 const refresh=result.refresh||result.refresh_token||result.tokens?.refresh;
 if(!access)throw Error('El login respondió, pero no encontramos el access token. Revisá el formato de respuesta en Swagger.');
 const storage=remember?localStorage:sessionStorage;storage.setItem(TOKEN_KEY,access);if(refresh)storage.setItem(REFRESH_KEY,refresh);
 if(result.user)localStorage.setItem('campuslab_user',JSON.stringify(result.user));
 return result;
}
export async function listProjects(){return isDemo()?demoList(false):unpack(await request('/api/projects'))}
export async function getPublicProject(slug){return isDemo()?demoGet(slug):request(`/api/projects/${encodeURIComponent(slug)}`)}
export async function teacherProjects(){return isDemo()?demoList(true):unpack(await request('/api/teacher/projects',{auth:true}))}
export async function teacherCourses(){return isDemo()?[{id:1,name:'Proyecto Integrador'},{id:2,name:'Frontend'},{id:3,name:'Backend'}]:unpack(await request('/api/teacher/courses',{auth:true}))}
export async function getTeacherProject(id){return isDemo()?demoGet(id):request(`/api/teacher/projects/${encodeURIComponent(id)}`,{auth:true})}
export async function createProject(payload){return isDemo()?demoSave(payload):request('/api/teacher/projects',{method:'POST',body:payload,auth:true})}
export async function updateProject(id,payload){return isDemo()?demoSave(payload,id):request(`/api/teacher/projects/${encodeURIComponent(id)}`,{method:'PATCH',body:payload,auth:true})}
export async function deleteProject(id){return isDemo()?demoDelete(id):request(`/api/teacher/projects/${encodeURIComponent(id)}`,{method:'DELETE',auth:true})}
export async function institutionProjects(){return isDemo()?demoList(true):unpack(await request('/api/institution/projects',{auth:true}))}
export async function reviewProject(id,action){return isDemo()?demoReview(id,action==='approve'?'approved':action==='reject'?'rejected':'changes_requested'):request(`/api/institution/projects/${encodeURIComponent(id)}/${action}`,{method:'POST',auth:true})}
export async function uploadAsset(id,file){const fd=new FormData();fd.append('file',file);return request(`/api/teacher/projects/${encodeURIComponent(id)}/assets`,{method:'POST',body:fd,auth:true,form:true})}
export async function addProjectLink(id,url,label){return request(`/api/teacher/projects/${encodeURIComponent(id)}/links`,{method:'POST',body:{url,label},auth:true})}
