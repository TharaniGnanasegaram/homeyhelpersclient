import React from 'react'
import { useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TimeSlotBooking from './AvailableTimeSlotForBookings';


function BookAppointment() {

    const navigate = useNavigate();

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: theme.palette.common.black,
            color: theme.palette.common.white,
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 14,
        },
    }));


    const [duration, setDuration] = React.useState(0.5);

    const handleDurationChange = (event) => {
        const value = parseFloat(event.target.value);
        if (!isNaN(value)) {
            setDuration(value);
        }
    };

    const { serviceproviderserviceid, servicename, serviceprovidername } = useParams();


    const [allServices, setAllServices] = React.useState([]);

    let query = `
                    query Query {
                        getAllServices {
                        _id
                        id
                        servicename
                        }
                    }
                `;

    function fetchingData() {

        fetch('https://juicy-inky-porcupine.glitch.me/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query })
        }).then(async (response) => {
            let varServices = await response.json();
            let tempList = varServices.data.getAllServices;
            setAllServices(tempList);
        })
    }


    useEffect(function () {
        fetchingData()
    }, []);


    const clearfilter = async (e) => {

        setDuration(0.5)
    }

    const backtoservices = async () => {

        navigate(`/searchserviceprovider`);
    }


    return (


        <div>
            <h2 id="serprohead">Appointment Booking</h2>

            <div id="serviceprodetails">
                <div>  <h4 class="detailshead"> Service Provider </h4> <h3 class="details"> {serviceprovidername}  </h3>
                </div>

                <div>
                    <h4 class="detailshead"> Service Name </h4> <h3 class="details"> {servicename}</h3>
                </div>

            </div>


            <Box component="form" id="addserviceform" name="addserviceform" sx={{ '& .MuiTextField-root': { m: 1, width: '35ch' }, }} noValidate autoComplete="off" >

                <div class="addserviceformdiv">

                    <label class="labelHead"> Select Time Duration Needed </label>

                    <div id="twocolumnsdiv">

                        <input
                            required
                            id="durationNeeded"
                            name="duration"
                            style={{ width: '80%', height: '40px' }}
                            type="number"
                            step="0.5"
                            min="0.5"
                            value={duration}
                            onChange={handleDurationChange}
                        />

                        <div id="btnsdiv">
                            <img class="imgiconsform" src="/clear.png" onClick={() => clearfilter()} title="Clear Filter" alt="Clear Filter" />

                            <img class="imgiconsform" src="/backbtn.png" onClick={() => backtoservices()} title="Back to Services" alt="Back to Services" />

                        </div>

                    </div>

                    {/* <span class="cleartext" onClick={clearfilter}>Clear</span> */}



                </div>
            </Box>

            <h4 id="formhead">Available Time Slots for Booking</h4>

            <div id="servicestable">

                <Paper>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 700 }} stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell align="center">DATE</StyledTableCell>
                                    <StyledTableCell align="center">START TIME</StyledTableCell>
                                    <StyledTableCell align="center">END TIME</StyledTableCell>
                                    <StyledTableCell align="center">UNIT PRICE</StyledTableCell>
                                    <StyledTableCell align="center">TOTAL PRICE</StyledTableCell>
                                    <StyledTableCell align="center">ADDITIONAL COMMENTS</StyledTableCell>
                                    <StyledTableCell align="center"> </StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TimeSlotBooking StyledTableCell={StyledTableCell} serviceproviderserviceid={serviceproviderserviceid} duration={duration} />
                            </TableBody>
                        </Table>
                    </TableContainer>

                </Paper>

            </div>

        </div>

    )

}

export default BookAppointment;