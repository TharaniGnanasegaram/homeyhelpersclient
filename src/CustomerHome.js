import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';


function CustomerHome() {

    const navigate = useNavigate();

    const userId = localStorage.getItem('userId');

    const navcustomer = async (e) => {
        e.preventDefault();
        navigate(`/mybookings/${userId}`);
    }

    const navservicepro = async (e) => {
        e.preventDefault();
        navigate(`/searchserviceprovider`);
    }


    return (


        <div>

            <h3 id="serprohead">Customer Portal</h3>

            <div>
                <img class="servhomeimg" src="cust3.jpg" ></img>
            </div>

            
            <div class="buttonDivOutService">
                <div class="buttonDivService">

                    <div class="container">
                        <img src="myservice1.png" alt="My Services" class="serhomeimgs" />
                        <Button variant="contained" onClick={navservicepro} class="buttonstyle"> Find Service Providers </Button>
                    </div>

                    <div class="container">
                        <img src="myappoint.png" alt="View My Appointments" class="serhomeimgs" />
                        <Button variant="contained" onClick={navcustomer} class="buttonstyle"> View My Bookings </Button>
                    </div>

                </div>
            </div>

        </div>
    )

}

export default CustomerHome;