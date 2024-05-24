import React from 'react'
import {Route, Routes} from 'react-router-dom'
import Auth from '../components/ProtectedRoutes/Auth'
import Doctor from '../components/ProtectedRoutes/Doctor'
import Guest from '../components/ProtectedRoutes/Guest'
import Home from '../Layouts/Home'
import links from './links'
// import HomePage from '../pages/HomePage'
// import LoginPage from '../pages/LoginPage'
// import RegisterPage from '../pages/RegisterPage'
 

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />}>
      {
          links.map(link=>{
            if(link.guest){
              return <Route key={link.name} path={link.url} element={<Guest element={<link.component />}/>} />
            }
            if(link.auth){
              return <Route key={link.name} path={link.url} element={<Auth element={<link.component />}/>} />
            }
            if(link.doctor){
              return <Route key={link.name} path={link.url} element={<Doctor element={<link.component />}/>} />
            }
            return <Route key={link.name} path={link.url} element={<link.component />} />
          })
      }
      
      </Route>
    </Routes>
  )
}
