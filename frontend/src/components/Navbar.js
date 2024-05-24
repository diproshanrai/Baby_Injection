import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {GiHamburgerMenu} from 'react-icons/gi'
import styles from '../styles/Nav.module.scss'
import Navscreen from './Navscreen'
import useUser from '../hooks/useUser'
import {FaLessThan} from 'react-icons/fa'
import Logout from './Logout'
import links from '../Routes/links'


export default function Navbar() {
  const [visible, setVisible] = useState(false)
  const open = ()=>setVisible(true)
  const close = ()=>setVisible(false)
  const {user, isAdmin} = useUser()
 
  

  
  return (
    <header className={styles.container}>
        <div className={`${styles.navlinks}  ms-auto d-none d-lg-flex me-4`}>
          { 
          links.filter(link=>{
            if(link.nested) return false;
            if(link.guest && user) return false;
            if(link.doctor && (!user || user.role!=="DOCTOR")) return false;
            if(link.auth && !user) return false;
            return true;
          })
          .map(link=>(
            
                <Link className='mx-2' key={link.name} to={link.url}>{link.name}</Link>
           
          )) 
          }
          {user && <Logout />}
        </div>
        <GiHamburgerMenu onClick={open}  className='fs-1 ms-auto me-4 text-white d-lg-none'/>
       {visible &&  <Navscreen links={links} handleClose={close}/>}
    </header>
  )
}
