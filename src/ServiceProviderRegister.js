import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';


function ServiceProviderPortal() {

    const [errors, setErrors] = React.useState({});

    const [values, setValues] = React.useState({});

    const navigate = useNavigate();

    const createServiceProvider = async (e) => {

        setErrors({});

        let isvalid = true;

        e.preventDefault();

        let formName = document.forms.createServiceProvider;

        const newServiceProvider = {
            username: formName.username.value,
            password: formName.password.value,
            firstname: formName.firstname.value,
            lastname: formName.lastname.value,
            email: formName.email.value,
            contactnumber: formName.contactnumber.value
        }

        let tempValues = { };
        tempValues.username = newServiceProvider.username;
        tempValues.password = newServiceProvider.password;
        tempValues.repassword = formName.repassword.value;
        tempValues.firstname = newServiceProvider.firstname;
        tempValues.lastname = newServiceProvider.lastname;
        tempValues.email = newServiceProvider.email;
        tempValues.contactnumber = newServiceProvider.contactnumber;

        setValues({
            ...tempValues,
        });


        let temp = { ...errors };
        temp.username = "";
        temp.password = "";
        temp.repassword = "";
        temp.firstname = "";
        temp.lastname = "";
        temp.email = "";
        temp.contactnumber = "";


        if (newServiceProvider.username === "") {
            isvalid = false;
            temp.username = 'This field is required.';
        }

        if (newServiceProvider.password === "") {
            isvalid = false;
            temp.password = 'This field is required.';
        }

        if (formName.repassword.value === "") {
            isvalid = false;
            temp.repassword = 'This field is required.';
        }

        if (newServiceProvider.password !== "" && formName.repassword.value !== "" && newServiceProvider.password !== formName.repassword.value) {
            isvalid = false;
            temp.repassword = 'Passwords do NOT match.';
        }

        if (newServiceProvider.firstname === "") {
            isvalid = false;
            temp.firstname = 'This field is required.';
        }

        if (newServiceProvider.lastname === "") {
            isvalid = false;
            temp.lastname = 'This field is required.';
        }

        if (newServiceProvider.email === "") {
            isvalid = false;
            temp.email = 'This field is required.';
        }

        if (newServiceProvider.contactnumber === "") {
            isvalid = false;
            temp.contactnumber = 'This field is required.';
        }

        if (newServiceProvider.contactnumber !== "" && ((newServiceProvider.contactnumber.length !== 10) || (isNaN(newServiceProvider.contactnumber)))) {
            isvalid = false;
            temp.contactnumber = 'Conatct number should be a number with 10 digits length.';
        }

        if(newServiceProvider.email !== "" && !ValidateEmail(newServiceProvider.email)){
            isvalid = false;
            temp.email = 'Email address is invalid. Please enter a valid email address.';
        }

        if (isvalid) {
            await registerServiceProvider(e, newServiceProvider);
            
        }

        else {

            setErrors({
                ...temp,
            });
        }
    }


    function ValidateEmail(mail) {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
            return (true)
        }
        return (false)
    }


    const registerServiceProvider = async (e, newServiceProvider) => {

        let query =
            `
          mutation Mutation($username: String!, $password: String!, $firstname: String!, $lastname: String!, $email: String!, $contactnumber: String!) {
            createServiceProvider(username: $username, password: $password, firstname: $firstname, lastname: $lastname, email: $email, contactnumber: $contactnumber) {
              
              contactnumber
              email
              firstname
              id
              lastname
              password
              username
            }
          }
          `

        const response = await fetch('https://juicy-inky-porcupine.glitch.me/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query, variables: { username: newServiceProvider.username, password: newServiceProvider.password, firstname: newServiceProvider.firstname, lastname: newServiceProvider.lastname, email: newServiceProvider.email, contactnumber: newServiceProvider.contactnumber } })

        });

        response.text().then(response => {
            const parsedResponse = JSON.parse(response);

            if (parsedResponse.errors) {
                const errorMessage = parsedResponse.errors[0].message;
                alert(errorMessage);
            }
            else {
                alert("Registered successfully!");
                e.target.reset();
                navigate(`/serviceproviderlogin`);
            }

        });

    }


    const loginUser = async (e) => {
        navigate(`/serviceproviderlogin`);
    }


    return (


        <div>
            <h3 id="serprohead">Service Provider Portal</h3>

            <div class="twocolumns">

                <div>
                    <img class="serproimg" src="servicepro2.jpg" ></img>
                </div>

                <Box component="form" id="createServiceProvider" name="createServiceProvider" onSubmit={createServiceProvider} sx={{ '& .MuiTextField-root': { m: 1, width: '35ch' }, }} noValidate autoComplete="off" >

                    <div class="signupformdiv">

                        <h4 id="formhead">Register</h4>

                        <TextField required id="username" type="text" label="User Name" name="username" helperText={errors.username} defaultValue={values.username} /> <br />

                        <TextField required id="password" type="password" label="Password" name="password" helperText={errors.password} defaultValue={values.password} /> <br />

                        <TextField required id="repassword" type="password" label="Re-enter Password" name="repassword" helperText={errors.repassword} defaultValue={values.repassword} /> <br />

                        <TextField required id="firstname" type="text" label="First Name" name="firstname" helperText={errors.firstname} defaultValue={values.firstname} /> <br />

                        <TextField required id="lastname" type="text" label="Last Name" name="lastname" helperText={errors.lastname} defaultValue={values.lastname} /> <br />

                        <TextField required id="email" type="email" label="Email" name="email" helperText={errors.email} defaultValue={values.email} /> <br />

                        <TextField required id="contactnumber" type="tel" label="Contact Number" name="contactnumber" helperText={errors.contactnumber} defaultValue={values.contactnumber} /> <br />

                        <div>
                            <Button variant="contained" type="submit" class="registerbuttonstyle">Register</Button>
                        </div>

                        <div>
                            <Button variant="outlined" type="button"  onClick={loginUser}>Already a user? Login!</Button>
                        </div>

                    </div>
                </Box>

            </div>
        </div>

    )

}

export default ServiceProviderPortal;