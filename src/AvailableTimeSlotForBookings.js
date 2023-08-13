import React from 'react'
import { useEffect, useContext } from "react";
import { Link, useParams } from 'react-router-dom';
import UserContext from './UserContext';
import { styled } from '@mui/material/styles';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';


function TimeSlotBooking({ StyledTableCell, serviceproviderserviceid, duration }) {

    const [myslots, setMyslots] = React.useState([]);

    const [serviceProvider, setServiceProvider] = React.useState('');

    const userId = localStorage.getItem('userId');

    const [reloadpage, setReloadpage] = React.useState(false);

    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
        '&:last-child td, &:last-child th': {
            border: 0,
        },
    }));

    const [comments, setComments] = React.useState('');

    const handleCommentsChange = (event) => {
        setComments(event.target.value);
        event.target.focus();
    };


    let query = `
                query  {
                    getServiceProviderAvailabilitySlotListByDuration(serviceproviderservicesid: "${serviceproviderserviceid}", duration: "${duration}") {
                    _id
                    id
                    serviceproviderservicesid
                    timeSlotid
                    start_time
                    end_time
                    duration
                    servicedate
                    hourlyrate
                    isavailable
                    isBooked
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
            let tempServiceList = tempMyServices.data.getServiceProviderAvailabilitySlotListByDuration;
            setMyslots(tempServiceList)
        })
    }


    let queryServiceProvider = `
                query {
                    getServiceProviderService(id: "${serviceproviderserviceid}") {
                    serviceproviderid
                    }
                }
            `;


   async function fetchingServiceProviderData() {

        fetch('http://localhost:4000/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: queryServiceProvider })
        }).then(async (response) => {
            let tempSerProv = await response.json();
            let tempServiProId = tempSerProv.data.getServiceProviderService;
            setServiceProvider(tempServiProId.serviceproviderid)
        })
    }


    useEffect(function () {
        fetchingMyServicesData()
        fetchingServiceProviderData()
    }, [duration, reloadpage]);



    const addBooking = async (availabilityid, userId, totalprice, servicedate) => {

        let formName = document.forms.commentform;
        let comment = formName.comments.value;

        let query =
            `
            mutation CreateBooking($serviceprovideravailabilityid: String!, $customerid: String!,  $serviceproviderid: String!, $totalprice: Float!, $bookingdate: String!, $comments: String) {
                createBooking(serviceprovideravailabilityid: $serviceprovideravailabilityid, customerid: $customerid, serviceproviderid: $serviceproviderid, totalprice: $totalprice, bookingdate: $bookingdate, comments: $comments) {
                  _id
                  id
                  serviceprovideravailabilityid
                  customerid
                  serviceproviderid
                  totalprice
                  bookingdate
                  comments
                  status
                }
              }
          `

        const response = await fetch('http://localhost:4000/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                query, variables: {
                    serviceprovideravailabilityid: availabilityid,
                    customerid: userId,
                    serviceproviderid: serviceProvider,
                    bookingdate: servicedate,
                    totalprice: parseFloat(totalprice),
                    comments: comment
                }
            })

        });

        response.text().then(response => {
            const parsedResponse = JSON.parse(response);

            if (parsedResponse.errors) {
                const errorMessage = parsedResponse.errors[0].message;
                alert(errorMessage);
            }
            else if (parsedResponse.data.createBooking == null) {
                alert("Booking Failed!");
            }
            else {
                alert("Booking created successfully!");
                (reloadpage) ? setReloadpage(false) : setReloadpage(true);
            }

        });

    }



    return (
        myslots && myslots.map((myser) => (
            <StyledTableRow key={myser._id}>

                <StyledTableCell align="center">{new Date(parseInt(myser.servicedate) + new Date().getTimezoneOffset() * 60000).toLocaleDateString('en-US')}</StyledTableCell>
                <StyledTableCell align="center">{myser.start_time}</StyledTableCell>
                <StyledTableCell align="center">{myser.end_time}</StyledTableCell>
                <StyledTableCell align="center">{myser.hourlyrate}</StyledTableCell>
                <StyledTableCell align="center">{myser.hourlyrate * duration}</StyledTableCell>
                <StyledTableCell align="center">
                    <form name = "commentform" noValidate autoComplete='off'>
                        <TextField multiline rows={2} maxRows={4} label="Comments" name="comments" variant="outlined" />
                    </form>
                </StyledTableCell>
                <StyledTableCell align="center"> <span class="clicktextBook" onClick={() => addBooking(myser._id, userId, myser.hourlyrate * duration, myser.servicedate)} >  Book Appointment </span></StyledTableCell>

            </StyledTableRow>
        ))
    );

}

export default TimeSlotBooking;