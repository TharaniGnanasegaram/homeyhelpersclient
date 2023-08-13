import React from 'react'
import { useEffect } from "react";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import ServiceProviderServices from './ServiceProviderServices';
import ServiceProviderReview from './ServiceProviderCheckReviewPopup';


function SearchServiceProviders() {

    const [reviewpopupvalues, setReviewPopupvalues] = React.useState({});

    const [showReviewPopup, setShowReviewPopup] = React.useState(false);

    const openReviewPopup = (idparm, isOpenParm = false) => {

        let tempPopupValues = {};
        tempPopupValues.idparm = idparm;

        setReviewPopupvalues({
            ...tempPopupValues,
        });

        setShowReviewPopup(isOpenParm);
        
    };

    const closeReviewPopup = () => {
        setShowReviewPopup(false);
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


    const [selectedService, setSelectedService] = React.useState('');

    const handleServiceChange = (event) => {
        setSelectedService(event.target.value);
    };


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

        setSelectedService('')
    }


    return (


        <div>
            <h2 id="serprohead">Search Service Providers</h2>

            <Box component="form" id="addserviceform" name="addserviceform" sx={{ '& .MuiTextField-root': { m: 1, width: '35ch' }, }} noValidate autoComplete="off" >

                <div class="addserviceformdiv">

                    <div id="twocolumnsdiv">

                        <TextField
                            required
                            id="services"
                            name="services"
                            select
                            label="Select Service"
                            value={selectedService}
                            onChange={handleServiceChange}
                        >
                            {allServices.map(function (item) {
                                return (
                                    <MenuItem key={item._id} value={item._id}>
                                        {item.servicename}
                                    </MenuItem>
                                );
                            })}
                        </TextField>

                        <img class="imgiconsform" src="/clear.png" onClick={() => clearfilter()} title="Clear Filter" alt="Clear Filter" />


                    </div>

                </div>
            </Box>

            <h4 id="formhead">Service Providers</h4>

            <div id="servicestable">

                <Paper>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 700 }} stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell align="center">SERVICE NAME</StyledTableCell>
                                    <StyledTableCell align="center">SERVICE PROVIDER NAME</StyledTableCell>
                                    <StyledTableCell align="center">HOURLY RATE</StyledTableCell>
                                    <StyledTableCell align="center">EXPERIENCE</StyledTableCell>
                                    <StyledTableCell align="center">CONTACT NUMBER</StyledTableCell>
                                    <StyledTableCell align="center">EMAIL</StyledTableCell>
                                    <StyledTableCell align="center">AVAILABILITY</StyledTableCell>
                                    <StyledTableCell align="center">REVIEWS</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <ServiceProviderServices StyledTableCell={StyledTableCell} serviceidparm={selectedService} openReviewPopupForm = {openReviewPopup} />
                            </TableBody>
                        </Table>
                    </TableContainer>

                </Paper>

            </div>

            {showReviewPopup && <ServiceProviderReview  closeReviewPopup = {closeReviewPopup} serviceproviderserviceid = {reviewpopupvalues.idparm} />}

        </div>

    )

}

export default SearchServiceProviders;