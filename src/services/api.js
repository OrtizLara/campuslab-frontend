// Centralizamos todas las llamadas HTTP para no repetir URLs en las pantallas.
export const API_BASE = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');
const ACCESS_KEY = 'campuslab_access';
const REFRESH_KEY = 'campuslab_refresh';
const getStore = () => localStorage.getItem('campuslab_persistent') === 'true' ? localStorage : sessionStorage;
export function getAccessToken() { return sessionStorage.getItem(ACCESS_KEY) || localStorage.getItem(ACCESS_KEY); }
export function clearSession() { for(const store of [sessionStorage,localStorage]){store.removeItem(ACCESS_KEY);store.removeItem(REFRESH_KEY);} localStorage.removeItem('campuslab_persistent'); }
export function saveSession(tokens, persistent=false) { clearSession(); const store=persistent?localStorage:sessionStorage; store.setItem(ACCESS_KEY,tokens.access); if(tokens.refresh)store.setItem(REFRESH_KEY,tokens.refresh); if(persistent)localStorage.setItem('campuslab_persistent','true'); }
export async function request(path, options={}) {
  const { auth=false, body, ...rest } = options;
  const headers = new Headers(rest.headers || {});
  headers.set('Accept','application/json');
  if(auth){const token=getAccessToken();if(!token)throw new Error('Iniciá sesión para continuar.');headers.set('Authorization',`Bearer ${token}`);}
  const isForm=body instanceof FormData;
  if(body!==undefined && !isForm)headers.set('Content-Type','application/json');
  let response;
  try { response=await fetch(`${API_BASE}${path}`, {...rest, headers, body:body===undefined?undefined:isForm?body:JSON.stringify(body)}); }
  catch { throw new Error(`No se pudo conectar con Django (${API_BASE}). Revisá que esté levantado y que permita CORS desde el frontend.`); }
  const contentType=response.headers.get('content-type')||'';
  const data=contentType.includes('json')?await response.json().catch(()=>null):await response.text().catch(()=>'');
  if(!response.ok){const detail=typeof data==='string'?data:(data?.detail||data?.message||data?.error||data?.errors||data);const msg=typeof detail==='string'&&detail.length<300?detail:JSON.stringify(detail||'');throw new Error(msg||`Error HTTP ${response.status}`);}
  return data;
}
export const qs = (values) => { const params=new URLSearchParams();Object.entries(values).forEach(([key,v])=>{if(v!==''&&v!==null&&v!==undefined){if(Array.isArray(v))v.forEach(x=>params.append(key,x));else params.set(key,v);}});return params.toString()?`?${params}`:''; };
export const api = {
  login: (email,password)=>request('/api/auth/login',{method:'POST',body:{email,password}}),
  me: ()=>request('/api/auth/me',{auth:true}),
  publicProjects: (filters={})=>request('/api/projects'+qs(filters)),
  publicProject: (slug)=>request(`/api/projects/${encodeURIComponent(slug)}`),
  technologies: (search='')=>request('/api/technologies'+qs({search})),
  institutions: ()=>request('/api/institutions'),
  careers: ()=>request('/api/careers'),
  teacherCourses: ()=>request('/api/teacher/courses',{auth:true}),
  courseStudents: id=>request(`/api/teacher/courses/${id}/students`,{auth:true}),
  teacherProjects: ()=>request('/api/teacher/projects',{auth:true}),
  teacherProject: id=>request(`/api/teacher/projects/${id}`,{auth:true}),
  createProject: body=>request('/api/teacher/projects',{auth:true,method:'POST',body}),
  updateProject: (id,body)=>request(`/api/teacher/projects/${id}`,{auth:true,method:'PATCH',body}),
  deleteProject: id=>request(`/api/teacher/projects/${id}`,{auth:true,method:'DELETE'}),
  uploadAsset: (id,formData)=>request(`/api/teacher/projects/${id}/assets`,{auth:true,method:'POST',body:formData}),
  institutionProjects: ()=>request('/api/institution/projects',{auth:true}),
  approveProject: id=>request(`/api/institution/projects/${id}/approve`,{auth:true,method:'POST'}),
  rejectProject: (id,body)=>request(`/api/institution/projects/${id}/reject`,{auth:true,method:'POST',body}),
  requestChanges: (id,body)=>request(`/api/institution/projects/${id}/request-changes`,{auth:true,method:'POST',body}),
};
