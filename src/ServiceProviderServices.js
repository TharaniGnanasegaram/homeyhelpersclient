import React from 'react'
import { useEffect, useContext } from "react";
import { Link } from 'react-router-dom';
import UserContext from './UserContext';
import { styled } from '@mui/material/styles';
import TableRow from '@mui/material/TableRow';


function ServiceProviderServices({ StyledTableCell, serviceidparm, openReviewPopupForm }) {

    const [myservices, setMyservices] = React.useState([]);

    // const { userId } = useContext(UserContext);

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
                query ServiceProviderServiceList($serviceid: String) {
                    ServiceProviderServiceList(serviceid: $serviceid) {
                    _id
                    id
                    serviceproviderid
                    serviceprovidername
                    serviceprovideremail
                    serviceprovidercontact
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
            body: JSON.stringify({ query, variables: { serviceid: serviceidparm } })
        }).then(async (response) => {
            let tempMyServices = await response.json();

            let tempServiceList = tempMyServices.data.ServiceProviderServiceList;
            setMyservices(tempServiceList)
        })
    }


    useEffect(function () {
        fetchingMyServicesData()
    }, [serviceidparm]);


    const handleopenReviewPopup = async (id, isOpenVal) => {
        openReviewPopupForm(id, isOpenVal)
    };



    if (!myservices) {

    }
    else {
        return (
            myservices.map((myser) => (
                <StyledTableRow key={myser._id}>

                    <StyledTableCell align="center">{myser.serviceid} </StyledTableCell>
                    <StyledTableCell align="center">{myser.serviceprovidername} </StyledTableCell>
                    <StyledTableCell align="center">{myser.hourlyrate}</StyledTableCell>
                    <StyledTableCell align="center">{myser.experience}</StyledTableCell>
                    <StyledTableCell align="center">{myser.serviceprovidercontact}</StyledTableCell>
                    <StyledTableCell align="center">{myser.serviceprovideremail}</StyledTableCell>
                    <StyledTableCell align="center"> <Link to={`/bookappointment/${myser._id}/${myser.serviceid}/${myser.serviceprovidername}`}>  <img class="imgicons" src="/availability.png" title="Check Availability" alt="Check Availability" /> </Link> </StyledTableCell>
                    <StyledTableCell align="right"> <img class="imgicons" src="review.png" onClick={() => handleopenReviewPopup(myser._id, true) } title="Check Reviews" alt="Check Reviews" /> </StyledTableCell>


                </StyledTableRow>
            ))
        );
    }



}

export default ServiceProviderServices;