import react from "react";
import logo from "../assets/logo.jpg";
const Header = () => {
  return (
    <div>
 <img src={logo} style={{
     width:"160px",height:"156px",
     display:"flex",
    
     alignSelf:"center",
     justifySelf:"center",
     margin:"0 auto",
     alignContent:"center",
     alignItems:"center"}}/>
  </div>
  );
};

export default Header;
