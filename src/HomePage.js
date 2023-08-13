import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';


function HomePage() {

    const navigate = useNavigate();

    const navcustomer = async (e) => {
        e.preventDefault();
        navigate(`/customerlogin`);
    }

    const navservicepro = async (e) => {
        e.preventDefault();
        navigate(`/serviceproviderlogin`);
    }


    return (


        <div>

            <div>
                <img class="homeimg" src="homeimg1.jpg" ></img>
            </div>

            <div id="descrip">
                <h3 id ="descripHead">There’s no place like home</h3>
            Homey Helpers is providing a platform to share the services and get the services with care and quality. 
            Experience the best service via Homey Helpers's smart platform to find the right skills to get your work done without haze. This connects Service Providers 
            such as plumbers, cookers, cleaners, electricians, childcare takers, vehicle repairing and gardening assistants, house decorators etc.
             Become a Service Provider : Choose the Service Provider portal and register yourself as a service Provider to help the needed customers. 
             Customers use the Customer portal to serach for the services you need, and to get connected with the appropriate service providers. Help each other to be a Happy Pill.

            </div>

            <div class="buttonDivOut">
                <div class="buttonDiv">

                    <div class="container">
                        <img src="servicepro.png" alt="Service Provider Portal" class="homeimgs" />
                        <Button variant="contained" onClick={navservicepro} class="buttonstyle">Service Provider Portal</Button> 
                    </div>

                    <div class="container">
                        <img src="customer.png" alt="Customer Portal" class="homeimgs" />
                        <Button variant="contained" onClick={navcustomer} class="buttonstyle">Customer Portal</Button> 
                    </div>

                </div>
            </div>

        </div>
    )

}

export default HomePage;