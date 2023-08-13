import React from 'react'
import { useEffect, useContext } from "react";
import { Link, useParams } from 'react-router-dom';
import UserContext from './UserContext';
import { styled } from '@mui/material/styles';
import TableRow from '@mui/material/TableRow';
import CircularProgress from '@mui/material/CircularProgress';



function ServiceProviderMySlots({ StyledTableCell, reloadpageParm }) {

    const [myslots, setMyslots] = React.useState([]);

    const { serviceproviderserviceid } = useParams();

    const [showLoader, setShowLoader] = React.useState(true);

    const userId = localStorage.getItem('userId');

    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
        '&:last-child td, &:last-child th': {
            border: 0,
        },
    }));


    let query = `
                query {
                    getServiceProviderAvailabilitySlotList(serviceproviderservicesid: "${serviceproviderserviceid}") {
                    _id
                    id
                    serviceproviderservicesid
                    timeSlotid
                    start_time
                    end_time
                    duration
                    servicedate
                    isavailable
                    }
                }
            `;


    function fetchingMyServicesData() {

        fetch('http://localhost:4000/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query })
        }).then(async (response) => {
            let tempMyServices = await response.json();
            let tempServiceList = tempMyServices.data.getServiceProviderAvailabilitySlotList;
            setMyslots(tempServiceList)
        })
    }


    useEffect(function () {
        fetchingMyServicesData()
    }, [userId, reloadpageParm]);



    const deleteServiceAvailabiltiy = async (serviceProviderServiceAvailableId) => {

        let query = `mutation {
            deleteServiceProviderServiceAvailability(id: "${serviceProviderServiceAvailableId}") {
                _id
                id
                serviceproviderservicesid
                timeSlotid
                start_time
                end_time
                duration
                servicedate
                isavailable
            }
          }`;

        fetch('http://localhost:4000/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query })

        }).then(async (response) => {
            alert("Time slot deleted successfully!")
            fetchingMyServicesData();
        })


    }

    setTimeout(() => {
        setShowLoader(false);
    }, 1000);


    if (showLoader) {

        return (

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: 'auto' }}>
                <CircularProgress />
            </div>
        )
    }

    else {

        return (
            myslots && myslots.map((myser) => (
                <StyledTableRow key={myser._id}>

                    <StyledTableCell align="center">{new Date(parseInt(myser.servicedate) + new Date().getTimezoneOffset() * 60000).toLocaleDateString('en-US')}</StyledTableCell>
                    <StyledTableCell align="center">{myser.start_time}</StyledTableCell>
                    <StyledTableCell align="center">{myser.end_time}</StyledTableCell>
                    <StyledTableCell align="center">{myser.duration}</StyledTableCell>
                    <StyledTableCell align="center"> <img class="imgicons" src="/delete.png" onClick={() => deleteServiceAvailabiltiy(myser._id)} title="Delete Timeslot" alt="Delete Timeslot" /> </StyledTableCell>

                </StyledTableRow>
            ))
        );
    }

}

export default ServiceProviderMySlots;