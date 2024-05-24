import styles from "../styles/Navscreen.module.scss";
import { ImCross } from "react-icons/im";
import Backdrop from "./Backdrop";
import { Link } from "react-router-dom";
import useUser from "../hooks/useUser";
import Logout from "./Logout";
export default function Navscreen({ handleClose, links = [] }) {
  const {user, isAdmin} = useUser();
  return (
    <Backdrop className={`d-lg-none`}>
      <ImCross
        onClick={handleClose}
        className={`fs-1  text-white ${styles.close}`}
      />
      <ul className={styles.container}>
        {links
           .filter(link=>{
            if(link.nested) return false;
            if(link.guest && user) return false;
            if(link.doctor && (!user || user.role!=="DOCTOR")) return false;
            if(link.auth && !user) return false;
            return true;
          })
          .map((link) => (
            <li key={link.name} className="mx-1 text-decoration-none">
              <Link onClick={handleClose} to={link.url}>
                {link.name}
              </Link>
            </li>
          ))}
          <li>{user && <Logout/>}</li>
      </ul>
    </Backdrop>
  );
}
