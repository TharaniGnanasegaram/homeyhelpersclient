import React from 'react'
import { useEffect } from "react";
import { styled } from '@mui/material/styles';
import TableRow from '@mui/material/TableRow';
import CircularProgress from '@mui/material/CircularProgress';


function CustomerBookingList({ StyledTableCell, eventdate, selectedStatus, openPopupForm }) {

    const [myBookings, setMybookings] = React.useState([]);

    const [showLoader, setShowLoader] = React.useState(true);

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

    setTimeout(() => {
        setShowLoader(false);
    }, 1000);

    let query = `
                    query {
                        getCustomerBookingList(customerid: "${userId}", servicedate: "${eventdate}", status: "${selectedStatus}") {
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
                        serviceproviderservicesid
                        serviceprovidername
                        serviceprovideremail
                        serviceprovidercontact
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
            let tempBookingList = tempMyBookings.data.getCustomerBookingList;
            setMybookings(tempBookingList)
        })
    }


    useEffect(function () {
        fetchingMyBookings()
    }, [eventdate, selectedStatus]);



    const addBooking = async (serviceproviderservicesid, userId, totalprice) => {

        let formName = document.forms.commentform;
        let comment = formName.comments.value;

        let query =
            `
            mutation CreateBooking($serviceprovideravailabilityid: String!, $customerid: String!, $totalprice: Float!, $comments: String) {
                createBooking(serviceprovideravailabilityid: $serviceprovideravailabilityid, customerid: $customerid, totalprice: $totalprice, comments: $comments) {
                  _id
                  id
                  serviceprovideravailabilityid
                  customerid
                  totalprice
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
                    serviceprovideravailabilityid: serviceproviderservicesid,
                    customerid: userId,
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


    async function checkdatevalidity(servicedate) {
        const twoDaysfromNow = new Date();
        twoDaysfromNow.setDate(twoDaysfromNow.getDate() + 2);

        const bookingDate = new Date(parseInt(servicedate) + new Date().getTimezoneOffset() * 60000);

        return bookingDate >= twoDaysfromNow;
    }


    const handleopenPopup = async (id, serviceproviderservicesid, isOpenVal) => {
        openPopupForm(id, serviceproviderservicesid, isOpenVal)
    };

    if (showLoader) {

        return (
            
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: 'auto' }}>
                <CircularProgress />
            </div>
        )
    }

    else {


        return (

            myBookings && myBookings.map((mybook) => {
                const isDateValid = checkdatevalidity(mybook.bookingdate);
                return (
                    <StyledTableRow key={mybook._id}>

                        <StyledTableCell align="center">{mybook.servicename}</StyledTableCell>
                        <StyledTableCell align="center">{mybook.serviceprovidername}</StyledTableCell>
                        <StyledTableCell align="center">{mybook.serviceprovidercontact}</StyledTableCell>
                        <StyledTableCell align="center">{mybook.serviceprovideremail}</StyledTableCell>
                        <StyledTableCell align="center">{mybook.comments}</StyledTableCell>
                        <StyledTableCell align="center">{new Date(parseInt(mybook.bookingdate) + new Date().getTimezoneOffset() * 60000).toLocaleDateString('en-US')}</StyledTableCell>
                        <StyledTableCell align="center">{mybook.duration}</StyledTableCell>
                        <StyledTableCell align="center">{mybook.start_time}</StyledTableCell>
                        <StyledTableCell align="center">{mybook.end_time}</StyledTableCell>
                        <StyledTableCell align="center">{mybook.totalprice}</StyledTableCell>
                        <StyledTableCell align="center"> <span class="statustext"> {mybook.status} </span></StyledTableCell>

                        <StyledTableCell align="center">

                            <div id="statusactions">
                                {(mybook.status === "Created" && (new Date(parseInt(mybook.bookingdate) + new Date().getTimezoneOffset() * 60000) >= new Date().setDate(new Date().getDate() + 2))) ? <img class="imgicons" src="/reject.png" onClick={() => updateBookingStatus(mybook._id, mybook.serviceprovideravailabilityid, "Cancelled")} title="Cancel Booking" alt="Cancel Booking" /> : ""}

                                {(mybook.status === "Completed") ? <img class="imgicons" src="/rating.png" onClick={() => handleopenPopup(mybook.serviceproviderservicesid, true)} title="Write Review" alt="Write a review" /> : ""}

                            </div>

                        </StyledTableCell>

                    </StyledTableRow>
                )
            })
        );

    }

}

export default CustomerBookingList;