import React from 'react'
import { useEffect } from "react";
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import CustomerBookingList from './CustomerBookingsList';
import ServiceProviderBookingList from './ServiceProviderBookingsList';


function ServiceProviderBooking() {

    const userId = localStorage.getItem('userId');

    const [eventdate, setEventdate] = React.useState('');

    const [selectedStatus, setSelectedStatus] = React.useState('');

    const handleStatusChange = (event) => {
        setSelectedStatus(event.target.value);
    };


    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: theme.palette.common.black,
            color: theme.palette.common.white,
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 14,
        },
    }));


    const handleDateChange = (event) => {
        setEventdate(event.target.value);
    };

    const clearfilter = async (e) => {

        setEventdate('');
        setSelectedStatus('');
    }


    return (


        <div>
            <h2 id="serprohead">My Appointments</h2>

            <Box component="form" id="addserviceform" name="addserviceform" sx={{ '& .MuiTextField-root': { m: 1, width: '35ch' }, }} noValidate autoComplete="off" >

                <div class="addserviceformdiv">

                    <div id="twocolumnsdiv">
                        <TextField sx={{ maxWidth: 400 }} required id="servicedate" style={{ width: '80%' }} type="date" name="servicedate" InputLabelProps={{ shrink: true, }} label="Event Date" name="eventdate" value={eventdate} onChange={handleDateChange} />

                        <TextField sx={{ maxWidth: 200 }} required id="status" name="status" select label="Status" value={selectedStatus} onChange={handleStatusChange}  >
                            {
                                ["Created", "Accepted", "Completed", "Rejected"].map(function (item) {
                                    return <MenuItem value={item}>{item}</MenuItem>
                                })
                            }

                        </TextField>

                        <img class="imgiconsform" src="/clear.png" onClick={() => clearfilter()} title="Clear Filter" alt="Clear Filter" />


                    </div>

                    {/* <span class="cleartext" onClick={clearfilter}>Clear</span> */}

                </div>
            </Box>

            <div id="bookingstable">

                <Paper>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 700 }} stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell align="center">SERVICE NAME</StyledTableCell>
                                    <StyledTableCell align="center">CUSTOMER NAME</StyledTableCell>
                                    <StyledTableCell align="center">CONTACT NUMBER</StyledTableCell>
                                    <StyledTableCell align="center">EMAIL</StyledTableCell>
                                    <StyledTableCell align="center">ADDRESS</StyledTableCell>
                                    <StyledTableCell align="center">COMMENTS</StyledTableCell>
                                    <StyledTableCell align="center">SERVICE DATE</StyledTableCell>
                                    <StyledTableCell align="center">NUMBER OF HOURS</StyledTableCell>
                                    <StyledTableCell align="center">START TIME</StyledTableCell>
                                    <StyledTableCell align="center">END TIME</StyledTableCell>
                                    <StyledTableCell align="center">TOTAL PRICE</StyledTableCell>
                                    <StyledTableCell align="center">STATUS</StyledTableCell>
                                    <StyledTableCell align="center">ACTIONS</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <ServiceProviderBookingList StyledTableCell={StyledTableCell} eventdate={eventdate} selectedStatus={selectedStatus} />
                            </TableBody>
                        </Table>
                    </TableContainer>

                </Paper>

            </div>

        </div>

    )

}

export default ServiceProviderBooking;