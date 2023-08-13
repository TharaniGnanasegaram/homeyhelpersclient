import React from 'react'
import { useEffect, useContext } from "react";
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import UserContext from './UserContext';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import DatePicker from 'react-datepicker';
import MenuItem from '@mui/material/MenuItem';
import 'react-datepicker/dist/react-datepicker.css';
import ServiceProviderMySlots from './ServiceProviderTimeAvailabilities';
import EditServiceAvailablePopup from './EditServiceAvailabilityPopupForm';


function AddTimeAvailable() {

    const [errors, setErrors] = React.useState({});

    const [popupvalues, setPopupvalues] = React.useState({});

    const [values, setValues] = React.useState({});

    const { serviceproviderserviceid, servicename } = useParams();

    const [reloadpage, setReloadpage] = React.useState(false);

    const [selectedStartTime, setSelectedStartTime] = React.useState(null);

    const [duration, setDuration] = React.useState(null);

    const [selectedDuration, setSelectedDuration] = React.useState('');

    const [timeSlots, setTimeSlots] = React.useState([]);

    const [selectDate, setSelectDate] = React.useState([]);

    const [isSlotAvailable, setSlotAvailable] = React.useState(false);

    const [timeSlotButtons, setTimeSlotButtons] = React.useState([]);

    const navigate = useNavigate();

    const handleDurationChange = (event) => {
        setSelectedDuration(event.target.value);
    };


    const handleDateChange = (event) => {
        setSelectDate(event.target.value);
    };


    const openPopup = (idParm, servicedateParm, starttimeParm, endtimeParm, durationParm, isOpenParm = false) => {

        let tempPopupValues = {};
        tempPopupValues.idparm = idParm;
        tempPopupValues.servicedateVar = servicedateParm;
        tempPopupValues.starttimeVar = starttimeParm;
        tempPopupValues.endtimeVar = endtimeParm;
        tempPopupValues.durationVar = durationParm;

        setPopupvalues({
            ...tempPopupValues,
        });


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


    const convertToHours = (timeInHoursMinutes) => {
        const timeRegex = /(\d+)h\s*(\d+)m/;
        const match = timeInHoursMinutes.match(timeRegex);

        if (match) {
            const hours = parseInt(match[1]);
            const minutes = parseInt(match[2]);
            const totalMinutes = hours * 60 + minutes;
            const hoursOnly = (totalMinutes / 60);
            return hoursOnly.toFixed(2);
        }

        return null;
    };



    const addTimeSlot = async (id) => {

        setErrors({});

        let isvalid = true;

        const newSlotService = {
            serviceproviderserviceid: serviceproviderserviceid,
            servicedate: selectDate,
            timeSlotid: id
        }

        let tempValues = {};
        tempValues.serviceproviderserviceid = newSlotService.serviceproviderserviceid;
        tempValues.servicedate = newSlotService.servicedate;
        tempValues.timeSlotid = newSlotService.timeSlotid;

        setValues({
            ...tempValues,
        });


        let temp = { ...errors };
        temp.servicedate = "";

        if (newSlotService.servicedate === "") {
            isvalid = false;
            temp.servicedate = 'This field is required.';
        }

        if (isvalid) {
            await addTimeSlotfunc(newSlotService);

        }

        else {

            setErrors({
                ...temp,
            });
        }
    }



    const addTimeSlotfunc = async (newSlotService) => {

        let query =
            `
            mutation CreateServiceProviderServiceAvailability($serviceproviderservicesid: String!, $servicedate: String!, $timeSlotid: String!) {
                createServiceProviderServiceAvailability(serviceproviderservicesid: $serviceproviderservicesid, servicedate: $servicedate, timeSlotid: $timeSlotid) {
                  _id
                  id
                  serviceproviderservicesid
                  timeSlotid
                  start_time
                  end_time
                  duration
                  servicedate
                  isavailable
                  isBooked
                }
              }
          `

        const response = await fetch('https://juicy-inky-porcupine.glitch.me/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                query, variables: {
                    serviceproviderservicesid: newSlotService.serviceproviderserviceid,
                    servicedate: newSlotService.servicedate,
                    timeSlotid: newSlotService.timeSlotid
                }
            })

        });

        response.text().then(response => {
            const parsedResponse = JSON.parse(response);

            if (parsedResponse.errors) {
                const errorMessage = parsedResponse.errors[0].message;
                alert(errorMessage);
            }
            else if (parsedResponse.data.createServiceProviderServiceAvailability == null) {
                alert("Adding Timeslot failed!");
                clearfilter();
            }
            else {
                alert("Timeslot added successfully!");
                (reloadpage) ? setReloadpage(false) : setReloadpage(true);
            }

        });

    }


    const getTimeSlots = async () => {

        let queryTimeSlots = `
                    query GetTimeSlotsByDuration {
                        getTimeSlotsByDuration {
                        _id
                        id
                        start_time
                        end_time
                        duration
                        }
                    }
                `;

        fetch('https://juicy-inky-porcupine.glitch.me/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: queryTimeSlots })
        }).then(async (response) => {
            let varTimeSlots = await response.json();
            let tempList = varTimeSlots.data.getTimeSlotsByDuration;
            setTimeSlots([]);
            setTimeSlots(tempList);
        })

    }


    const clearfilter = async () => {

        setSelectedDuration('');
        setSelectDate([])

    }


    const backtoservices = async () => {

        navigate(`/addservice`);
    }


    const getTimeSlotAvailable = async (slotid, start_time, end_time) => {
        let query = `
          query {
            isServiceProviderSlotAvailable(serviceproviderservicesid: "${serviceproviderserviceid}", servicedate: "${selectDate}", timeSlotid: "${slotid}", start_time: "${start_time}", end_time: "${end_time}")
          }
        `;

        const response = await fetch('https://juicy-inky-porcupine.glitch.me/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query })
        });

        const result = await response.json();

        if (result.errors) {
            const errorMessage = result.errors[0].message;
            alert(errorMessage);
        } else {
            const avail = result.data.isServiceProviderSlotAvailable;
            return avail;
        }
    };



    useEffect(() => {
        const renderTimeSlotButtons = async () => {
            const buttons = await Promise.all(
                timeSlots.map(async (item) => {
                    if (parseFloat(item.duration) === parseFloat(selectedDuration)) {
                        const isAvailable = await getTimeSlotAvailable(item._id, item.start_time, item.end_time);
                        return (
                            <Button
                                key={item._id}
                                disabled={isAvailable}
                                variant="outlined"
                                class="timeslotbtn"
                                onClick={() => addTimeSlot(item._id)}
                            >
                                {item.start_time} - {item.end_time}
                            </Button>
                        );
                    }
                    return null;
                })
            );

            setTimeSlotButtons(buttons);
        };

        renderTimeSlotButtons();
    }, [timeSlots, selectedDuration]);



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
        getTimeSlots()
        clearfilter()
    }, [reloadpage]);


    return (

        <div>
            <h2 id="serprohead">Add Time Availability - {servicename}</h2>

            <Box component="form" id="addtimeavailform" name="addtimeavailform" onSubmit={addTimeSlot} sx={{ '& .MuiTextField-root': { m: 1, width: '35ch' }, }} noValidate autoComplete="off" >

                <div id="addserviceslotdiv">

                    <div id="twocolumnsdiv">
                        <TextField sx={{ maxWidth: 400 }} required id="servicedate" style={{ width: '80%' }} type="date" name="servicedate" InputLabelProps={{ shrink: true, }} label="Event Date" name="eventdate" onChange={handleDateChange} value={selectDate} helperText={errors.servicedate} />

                        <TextField sx={{ maxWidth: 200 }} required id="durationhours" name="durationhours" select label="Duration" value={selectedDuration} helperText={errors.durationhours} onChange={handleDurationChange} >
                            {
                                [0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 7, 8].map(function (item) {
                                    return <MenuItem value={item}>{item}</MenuItem>
                                })
                            }

                        </TextField>

                        <div id = "btnsdiv">
                            <img class="imgiconsform" src="/clear.png" onClick={() => clearfilter()} title="Clear Filter" alt="Clear Filter" />

                            <img class="imgiconsform" src="/backbtn.png" onClick={() => backtoservices()} title="Back to Services" alt="Back to Services" />

                        </div>

                    </div>

                    <div id="timebuttonsdiv" style={{ marginTop: '10px' }}>

                        <div>
                            {timeSlotButtons}
                        </div>

                    </div>

                </div>
            </Box>

            <h4 id="formhead">My Time Slots</h4>

            <div id="servicestable">

                <Paper>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 700 }} stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell align="center">DATE</StyledTableCell>
                                    <StyledTableCell align="center">START TIME</StyledTableCell>
                                    <StyledTableCell align="center">END TIME</StyledTableCell>
                                    <StyledTableCell align="center">DURATION (Hr) </StyledTableCell>
                                    <StyledTableCell align="center"> </StyledTableCell>
                                    {/* <StyledTableCell align="right"> </StyledTableCell> */}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <ServiceProviderMySlots StyledTableCell={StyledTableCell} reloadpageParm={reloadpage} />
                            </TableBody>
                        </Table>
                    </TableContainer>

                </Paper>

            </div>

            {/* {showPopup && <EditServiceAvailablePopup convertToHoursFunc={convertToHours} closePopup={closePopup} serviceproviderserviceAvailableid={popupvalues.idparm} servicedateVar={popupvalues.servicedateVar} starttimeVar={popupvalues.starttimeVar} endtimeVar={popupvalues.endtimeVar} durationVar={popupvalues.durationVar} />} */}

        </div>

    )

}

export default AddTimeAvailable;