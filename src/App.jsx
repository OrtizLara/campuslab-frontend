import { Route,Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { PrivateRoute } from './components/Common';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Detail from './pages/Detail';
import Login from './pages/Login';
import Teacher from './pages/Teacher';
import TeacherProjects from './pages/TeacherProjects';
import ProjectEditor from './pages/ProjectEditor';
import Institution from './pages/Institution';
import Admin from './pages/Admin';
export default function App(){return <Routes><Route element={<Layout/>}><Route index element={<Home/>}/><Route path="proyectos" element={<Catalog/>}/><Route path="proyectos/:slug" element={<Detail/>}/><Route path="login" element={<Login/>}/><Route path="docente" element={<PrivateRoute roles={['TEACHER']}><Teacher/></PrivateRoute>}/><Route path="docente/proyectos" element={<PrivateRoute roles={['TEACHER']}><TeacherProjects/></PrivateRoute>}/><Route path="docente/proyectos/nuevo" element={<PrivateRoute roles={['TEACHER']}><ProjectEditor/></PrivateRoute>}/><Route path="docente/proyectos/:id/editar" element={<PrivateRoute roles={['TEACHER']}><ProjectEditor/></PrivateRoute>}/><Route path="institucion" element={<PrivateRoute roles={['INSTITUTION']}><Institution/></PrivateRoute>}/><Route path="administracion" element={<PrivateRoute roles={['ADMIN','SUPERADMIN']}><Admin/></PrivateRoute>}/><Route path="*" element={<div className="container section-space"><h1>Página no encontrada</h1><p>Revisá la dirección o volvé al inicio.</p></div>}/></Route></Routes>}
