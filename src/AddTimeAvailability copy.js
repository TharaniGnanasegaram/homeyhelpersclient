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
import 'react-datepicker/dist/react-datepicker.css';
import ServiceProviderMySlots from  './ServiceProviderTimeAvailabilities';
import EditServiceAvailablePopup from './EditServiceAvailabilityPopupForm';


function AddTimeAvailable() {

    const [errors, setErrors] = React.useState({});

    const [popupvalues, setPopupvalues] = React.useState({});

    const [values, setValues] = React.useState({});

    const { serviceproviderserviceid, servicename } = useParams();

    const [showPopup, setShowPopup] = React.useState(false);

    const [selectedStartTime, setSelectedStartTime] = React.useState(null);

    const [duration, setDuration] = React.useState(null);

    const handleStartTimeChange = (time) => {
        setSelectedStartTime(time);
        calculateDuration(time, selectedEndTime);
    };

    const [selectedEndTime, setSelectedEndTime] = React.useState(null);

    const handleEndTimeChange = (time) => {
        setSelectedEndTime(time);
        calculateDuration(selectedStartTime, time);
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

        setShowPopup(isOpenParm);
        
    };

    const closePopup = () => {
        setShowPopup(false);
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



    const addTimeSlot = async (e) => {

        setErrors({});

        let isvalid = true;

        e.preventDefault();

        let formName = document.forms.addtimeavailform;

        const newSlotService = {
            serviceproviderservicesid: serviceproviderserviceid,
            servicedate: formName.servicedate.value,
            starttime: formName.starttime.value,
            endtime: formName.endtime.value,
            duration: formName.duration.value,
        }

        let tempValues = {};
        tempValues.serviceproviderservicesid = newSlotService.serviceproviderservicesid;
        tempValues.servicedate = newSlotService.servicedate;
        tempValues.starttime = newSlotService.starttime;
        tempValues.endtime = newSlotService.endtime;
        tempValues.duration = newSlotService.duration;

        setValues({
            ...tempValues,
        });


        let temp = { ...errors };
        temp.servicedate = "";
        temp.starttime = "";
        temp.endtime = "";

        if (newSlotService.servicedate === "") {
            isvalid = false;
            temp.servicedate = 'This field is required.';
        }

        if (newSlotService.starttime === "") {
            isvalid = false;
            temp.starttime = 'This field is required.';
        }

        if (newSlotService.endtime === "") {
            isvalid = false;
            temp.endtime = 'This field is required.';
        }


        if (isvalid) {
            newSlotService.duration =  parseFloat(convertToHours(newSlotService.duration));
            await addTimeSlotfunc(e, newSlotService);

        }

        else {

            setErrors({
                ...temp,
            });
        }
    }



    const addTimeSlotfunc = async (e, newSlotService) => {

        console.log("dura " + newSlotService.duration)

        let query =
            `
            mutation CreateServiceProviderServiceAvailability($serviceproviderservicesid: String!, $servicedate: String!, $starttime: String!, $endtime: String!, $duration: Float!) {
                createServiceProviderServiceAvailability(serviceproviderservicesid: $serviceproviderservicesid, servicedate: $servicedate, starttime: $starttime, endtime: $endtime, duration: $duration) {
                  _id
                  id
                  serviceproviderservicesid
                  servicedate
                  starttime
                  endtime
                  duration
                  isavailable
                }
              }
          `

        const response = await fetch('https://juicy-inky-porcupine.glitch.me/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                query, variables: {
                    serviceproviderservicesid: serviceproviderserviceid,
                    servicedate: newSlotService.servicedate,
                    starttime: newSlotService.starttime,
                    endtime: newSlotService.endtime,
                    duration: newSlotService.duration
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
                alert("Adding Time Slot failed!");
            }
            else {
                alert("Time SLot added successfully!");
                e.target.reset();
            }

        });

    }

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


    const calculateDuration = (startTime, endTime) => {
        if (startTime && endTime) {
            const diffInMilliseconds = Math.abs(endTime - startTime);
            const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
            const hours = Math.floor(diffInMinutes / 60);
            const minutes = diffInMinutes % 60;
            const formattedDuration = `${hours}h ${minutes+1}m`;
            setDuration(formattedDuration);
        } else {
            setDuration('');
        }
    };


    return (

        <div>
            <h2 id="serprohead">Add Time Availability - {servicename}</h2>

            <Box component="form" id="addtimeavailform" name="addtimeavailform" onSubmit={addTimeSlot} sx={{ '& .MuiTextField-root': { m: 1, width: '35ch' }, }} noValidate autoComplete="off" >

                <div class="addserviceformdiv">

                    <TextField required id="servicedate" style={{ width: '80%'}} type="date" name="servicedate" InputLabelProps={{ shrink: true, }} label="Event Date" name="eventdate" helperText={errors.servicedate} />


                    <div>
                        <TextField
                            label="Start Time"
                            value={selectedStartTime ? selectedStartTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).toUpperCase() : ''}
                            style={{
                                width: '80%',
                            }}
                            helperText={errors.starttime}
                            InputLabelProps={{ shrink: true }}
                            InputProps={{
                                endAdornment: (
                                    <DatePicker
                                        name="starttime"
                                        selected={selectedStartTime}
                                        onChange={handleStartTimeChange}
                                        showTimeSelect
                                        showTimeSelectOnly
                                        timeIntervals={15}
                                        timeCaption="Time"
                                        dateFormat="h:mm aa"
                                        className="mydatetimepick"
                                    />
                                ),
                            }}
                        />

                    </div>

                    <div>
                        <TextField
                            label="End Time"
                            value={selectedEndTime ? selectedEndTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).toUpperCase() : ''}
                            style={{
                                width: '80%',
                            }}
                            helperText={errors.endtime}
                            InputLabelProps={{ shrink: true }}
                            InputProps={{
                                endAdornment: (
                                    <DatePicker
                                        name="endtime"
                                        selected={selectedEndTime}
                                        onChange={handleEndTimeChange}
                                        showTimeSelect
                                        showTimeSelectOnly
                                        timeIntervals={15}
                                        timeCaption="Time"
                                        dateFormat="h:mm aa"
                                        className="mydatetimepick"
                                    />
                                ),
                            }}
                        />

                    </div>

                    <TextField required id="duration" disabled style={{ width: '80%'}} type="text" InputLabelProps={{ shrink: true }} label="Duration" name="duration" value={duration}  onChange={(event) => setDuration(event.target.value)} />

                    <div>
                        <Button variant="contained" type="submit" class="registerbuttonstyle">Add Time Slot</Button>
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
                                    <StyledTableCell align="right"> </StyledTableCell>
                                    <StyledTableCell align="right"> </StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <ServiceProviderMySlots StyledTableCell={StyledTableCell} openPopupForm={openPopup} />
                            </TableBody>
                        </Table>
                    </TableContainer>

                </Paper>

            </div>

            {showPopup && <EditServiceAvailablePopup convertToHoursFunc = {convertToHours}  closePopup = {closePopup} serviceproviderserviceAvailableid = {popupvalues.idparm} servicedateVar = {popupvalues.servicedateVar} starttimeVar = {popupvalues.starttimeVar} endtimeVar = {popupvalues.endtimeVar}  durationVar = {popupvalues.durationVar} />}

        </div>

    )

}

export default AddTimeAvailable;