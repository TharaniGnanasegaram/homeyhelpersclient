import React from 'react'
import { useEffect, useContext } from "react";
import { Link } from 'react-router-dom';
import UserContext from './UserContext';
import { styled } from '@mui/material/styles';
import TableRow from '@mui/material/TableRow';


function ServiceProviderMyServices({ StyledTableCell, openPopupForm, openReviewPopupForm, reloadVar }) {

    const [myservices, setMyservices] = React.useState([]);

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
                    ServiceProviderServiceList(serviceproviderid: "${userId}") {
                    _id
                    id
                    serviceproviderid
                    serviceid
                    hourlyrate
                    experience
                    }
                }
            `;


    function fetchingMyServicesData() {

        fetch('https://juicy-inky-porcupine.glitch.me/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query })
        }).then(async (response) => {
            let tempMyServices = await response.json();
            let tempServiceList = tempMyServices.data.ServiceProviderServiceList;
            setMyservices(tempServiceList)
        })
    }


    useEffect(function () {
        fetchingMyServicesData()
    }, [userId, reloadVar]);



    const deleteService = async (serviceProviderServiceId) => {

        let query = `mutation {
            deleteServiceProviderService(id: "${serviceProviderServiceId}") {
              _id
              id
              serviceproviderid
              serviceid
              hourlyrate
              experience
            }
          }`;

        fetch('https://juicy-inky-porcupine.glitch.me/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query })

        }).then(async (response) => {
            alert("Service deleted successfully!")
            fetchingMyServicesData();
        })


    }



    const handleopenPopup = async (id, serviceidval, hourlyrateval, experiencval, isOpenVal) => {
        openPopupForm(id, serviceidval, hourlyrateval, experiencval, isOpenVal)
    };

    const handleopenReviewPopup = async (id, isOpenVal) => {
        openReviewPopupForm(id, isOpenVal)
    };


    return (
        myservices.map((myser) => (
            <StyledTableRow key={myser._id}>

                <StyledTableCell align="left">{myser.serviceid}</StyledTableCell>
                <StyledTableCell align="left">{myser.hourlyrate}</StyledTableCell>
                <StyledTableCell align="left">{myser.experience}</StyledTableCell>
                <StyledTableCell align="right"> <img class="imgicons" src="edit.png" title="Edit service" alt="Edit service" onClick={() => handleopenPopup(myser._id, myser.serviceid, myser.hourlyrate, myser.experience, true)} /> </StyledTableCell>
               
                <StyledTableCell align="right">
                    <Link to={`/addtimeavailability/${myser._id}/${myser.serviceid}`}>  <img class="imgicons" src="/timetable.png" title="Add Time Availability" alt="Add Time Availability" /> </Link>
                </StyledTableCell>

                <StyledTableCell align="right"> <img class="imgicons" src="review.png" onClick={() => handleopenReviewPopup(myser._id, true) } title="Check Reviews" alt="Check Reviews" /> </StyledTableCell>

                <StyledTableCell align="right"> <img class="imgicons" src="delete.png" onClick={() => deleteService(myser._id)} title="Delete service" alt="Delete service" /> </StyledTableCell>

            </StyledTableRow>
        ))
    );

}

export default ServiceProviderMyServices;