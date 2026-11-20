const KEY = 'campuslab_demo_projects';
const seed = [
  {id:1, slug:'eco-campus',title:'EcoCampus',description:'Plataforma para registrar iniciativas sustentables y actividades de reciclaje dentro de la institución.',technologies:['HTML','CSS','JavaScript'],status:'approved',career_name:'Desarrollo de Software',course_name:'Proyecto Integrador',members:['Ana Martínez','Lucas Ríos'],links:[{url:'https://github.com',label:'Repositorio'}],created_at:'2026-10-12'},
  {id:2, slug:'turnos-salud',title:'Turnos Salud',description:'Sistema de organización de turnos, pacientes y recordatorios para centros de salud.',technologies:['Python','Django','SQLite'],status:'approved',career_name:'Desarrollo de Software',course_name:'Backend',members:['Camila Díaz'],links:[],created_at:'2026-09-20'},
  {id:3, slug:'biblioteca-digital',title:'Biblioteca Digital',description:'Catálogo colaborativo de libros y préstamos, con búsquedas y filtros.',technologies:['JavaScript','Bootstrap'],status:'pending',career_name:'Desarrollo de Software',course_name:'Frontend',members:['Sofía Pérez','Mateo Gil'],links:[],created_at:'2026-11-01'},
  {id:4, slug:'huerta-en-red',title:'Huerta en Red',description:'Herramienta para coordinar huertas comunitarias y compartir recursos.',technologies:['HTML','CSS','Python'],status:'approved',career_name:'Gestión Ambiental',course_name:'Taller de Proyectos',members:['Valentina López'],links:[],created_at:'2026-08-13'}
];
export const demoProjects = () => {let s=localStorage.getItem(KEY);if(!s){localStorage.setItem(KEY,JSON.stringify(seed));return structuredClone(seed)}try{return JSON.parse(s)}catch{return structuredClone(seed)}};
const save = a => localStorage.setItem(KEY,JSON.stringify(a));
export const demoList = (teacher=false) => demoProjects().filter(x=>teacher || x.status==='approved');
export const demoGet = id => demoProjects().find(x=>String(x.id)===String(id)||x.slug===id);
export const demoSave = (payload,id) => {let a=demoProjects();if(id){const i=a.findIndex(x=>String(x.id)===String(id));if(i<0)throw Error('Proyecto no encontrado');a[i]={...a[i],...payload};save(a);return a[i]}let n=Date.now();const item={...payload,id:n,slug:`proyecto-${n}`,status:'pending',created_at:new Date().toISOString(),technologies:payload.technologies||[],links:payload.links||[]};a.unshift(item);save(a);return item};
export const demoDelete = id => {save(demoProjects().filter(x=>String(x.id)!==String(id)));};
export const demoReview = (id,status) => {const x=demoGet(id);if(!x)throw Error('Proyecto no encontrado');return demoSave({status},id)};
