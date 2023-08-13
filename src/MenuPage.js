import React from 'react'
import { useContext } from "react";
import { Link, BrowserRouter } from "react-router-dom";
import PageRoutes from "./PageRoutes";
import UserContext from './UserContext';



function Menus() {

    const { userId, userTypeId } = useContext(UserContext);

    console.log("user type " + userTypeId)

    const { logout } = useContext(UserContext);

    return (
        <BrowserRouter>
            <div>

                <div class="titleHeadingStyle">
                    {(userTypeId == null) ? (<Link to="/" > <img id="logoimg" src="/logo4.png" ></img> </Link>)
                    : (((userTypeId === '100') ? (<Link to="/customerhome" > <img id="logoimglogin" src="/logo4.png" ></img> </Link>) : (<Link to="/serviceproviderhome" > <img id="logoimglogin" src="/logo4.png" ></img> </Link>)))
                    }
                    
                </div>

                <div>
                    {/* <h1 id="titleName">Homey Helpers</h1> */}
                </div>

                <nav class="nav">

                    <ul class="nav_ul">
                       {(userTypeId != null) ? (((userTypeId === '100') ? (<li> <Link to="/customerhome" class="nav_ul_link" >Home</Link> </li>) : (<li> <Link to="/serviceproviderhome" class="nav_ul_link" >Home</Link> </li>) )) : (<li> <Link to="/" class="nav_ul_link" >Home</Link> </li>) } 
                       {(userTypeId === null) ? (<li> <Link to="/serviceproviderlogin" class="nav_ul_link" >Service Provider Portal</Link> </li>) : null } 
                       {(userTypeId === null) ? ( <li> <Link to="/customerlogin" class="nav_ul_link" >Customer Portal</Link> </li> ) : ""} 
                       {(userTypeId === '100') ? (
                       <li> <Link to="/searchserviceprovider" class="nav_ul_link" >Find Services</Link> </li>
                       ) : null }
                       {(userTypeId === '100') ? (
                       <li> <Link to="/mybookings/${userId}" class="nav_ul_link" >My Bookings</Link> </li>
                       ) : null }
                       {(userTypeId === '200') ? (
                       <li> <Link to="/addservice" class="nav_ul_link" >My Services</Link> </li>
                       ) : null }
                       {(userTypeId === '200') ? (
                       <li> <Link to="/myCustomerbookings/${userId}" class="nav_ul_link" >My Appointments</Link> </li>
                       ) : null }
                        { ((userTypeId != null) ? (<li onClick={() => logout()} > <Link to="/" class="nav_ul_link" >Logout</Link> </li>) : null ) } 

                    </ul>

                </nav>

                <div id="homecontent">
                    <hr id="linehr" />
                </div>

                <PageRoutes />

            </div>
        </BrowserRouter>

    )
}

export default Menus;