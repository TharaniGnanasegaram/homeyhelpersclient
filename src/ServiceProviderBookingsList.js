import React from 'react'
import { useEffect } from "react";
import { styled } from '@mui/material/styles';
import TableRow from '@mui/material/TableRow';
import CircularProgress from '@mui/material/CircularProgress';


function ServiceProviderBookingList({ StyledTableCell, eventdate, selectedStatus }) {

    const [myBookings, setMybookings] = React.useState([]);

    const userId = localStorage.getItem('userId');

    const [showLoader, setShowLoader] = React.useState(true);

    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
        '&:last-child td, &:last-child th': {
            border: 0,
        },
    }));


    setTimeout(() => {
        setShowLoader(false);
    }, 1000);

    let query = `
                query  {
                    getServiceProviderBookingList(serviceproviderid: "${userId}", servicedate: "${eventdate}", status: "${selectedStatus}") {
                    _id
                    id
                    serviceprovideravailabilityid
                    customerid
                    totalprice
                    comments
                    status
                    start_time
                    end_time
                    duration
                    bookingdate
                    hourlyrate
                    servicename
                    customername
                    customeremail
                    customercontact
                    customeraddress
                    }
                }
            `;


    function fetchingMyBookings() {

        fetch('http://localhost:4000/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query })
        }).then(async (response) => {
            let tempMyBookings = await response.json();
            let tempBookingList = tempMyBookings.data.getServiceProviderBookingList;
            setMybookings(tempBookingList)
        })
    }


    useEffect(function () {
        fetchingMyBookings()
    }, [eventdate, selectedStatus]);


    const updateBookingStatus = async (bookingid, serviceprovideravailabilityid, newstatus) => {

        let query = `mutation {
            updateBookingStatus(id: "${bookingid}", newstatus: "${newstatus}", serviceprovideravailabilityid: "${serviceprovideravailabilityid}") {
              _id
            }
          }`;

        fetch('http://localhost:4000/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query })

        }).then(async (response) => {
            alert("Status updated successfully!")
            fetchingMyBookings();
        })


    }


    if (showLoader) {

        return (

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: 'auto' }}>
                <CircularProgress />
            </div>
        )
    }

    else {

        return (
            myBookings && myBookings.map((mybook) => (
                <StyledTableRow key={mybook._id}>

                    <StyledTableCell align="center">{mybook.servicename}</StyledTableCell>
                    <StyledTableCell align="center">{mybook.customername}</StyledTableCell>
                    <StyledTableCell align="center">{mybook.customercontact}</StyledTableCell>
                    <StyledTableCell align="center">{mybook.customeremail}</StyledTableCell>
                    <StyledTableCell align="center">{mybook.customeraddress}</StyledTableCell>
                    <StyledTableCell align="center">{mybook.comments}</StyledTableCell>
                    <StyledTableCell align="center">{new Date(parseInt(mybook.bookingdate) + new Date().getTimezoneOffset() * 60000).toLocaleDateString('en-US')}</StyledTableCell>
                    <StyledTableCell align="center">{mybook.duration}</StyledTableCell>
                    <StyledTableCell align="center">{mybook.start_time}</StyledTableCell>
                    <StyledTableCell align="center">{mybook.end_time}</StyledTableCell>
                    <StyledTableCell align="center">{mybook.totalprice}</StyledTableCell>
                    <StyledTableCell align="center"> <span class="statustext"> {mybook.status} </span></StyledTableCell>
                    <StyledTableCell align="center">

                        <div id="statusactions">
                            {(mybook.status === "Created") ? <img class="imgicons" src="/approve.png" onClick={() => updateBookingStatus(mybook._id, mybook.serviceprovideravailabilityid, "Accepted")} title="Accept Booking" alt="Accept Booking" /> : ""}
                            {(mybook.status === "Created") ? <img class="imgicons" src="/reject.png" onClick={() => updateBookingStatus(mybook._id, mybook.serviceprovideravailabilityid, "Rejected")} title="Reject Booking" alt="Reject Booking" /> : ""}
                            {(mybook.status === "Accepted") ? <img class="imgicons" src="/complete.png" onClick={() => updateBookingStatus(mybook._id, mybook.serviceprovideravailabilityid, "Completed")} title="Complete Booking" alt="Complete Booking" /> : ""}
                        </div>

                    </StyledTableCell>

                </StyledTableRow>
            ))
        );
    }

}

export default ServiceProviderBookingList;