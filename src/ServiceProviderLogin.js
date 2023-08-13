import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import UserContext from './UserContext';


function ServiceProviderLogin() {

    const [errors, setErrors] = React.useState({});

    const [values, setValues] = React.useState({});

    const [userId, setUserId] = useState('');

    const { login } = useContext(UserContext);

    const navigate = useNavigate();


    const handleLogin = (loggedInUserId) => {
        setUserId(loggedInUserId);
        login(loggedInUserId, '200');
    };


    const loginServiceProvider = async (e) => {

        setErrors({});

        let isvalid = true;

        e.preventDefault();

        let formName = document.forms.loginServiceProviderform;

        const newServiceProvider = {
            username: formName.username.value,
            password: formName.password.value
        }

        let tempValues = {};
        tempValues.username = newServiceProvider.username;
        tempValues.password = newServiceProvider.password;

        setValues({
            ...tempValues,
        });


        let temp = { ...errors };
        temp.username = "";
        temp.password = "";


        if (newServiceProvider.username === "") {
            isvalid = false;
            temp.username = 'This field is required.';
        }

        if (newServiceProvider.password === "") {
            isvalid = false;
            temp.password = 'This field is required.';
        }


        if (isvalid) {
            await loginServiceProviderfunc(e, newServiceProvider);

        }

        else {

            setErrors({
                ...temp,
            });
        }
    }



    const loginServiceProviderfunc = async (e, newServiceProvider) => {

        let query =
            `
            query LoginServiceProvider($username: String!, $password: String!) {
                loginServiceProvider(username: $username, password: $password) {
                  _id
                  id
                  username
                  password
                  firstname
                  lastname
                  email
                  contactnumber
                }
              }
          `

        const response = await fetch('http://localhost:4000/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query, variables: { username: newServiceProvider.username, password: newServiceProvider.password } })

        });

        response.text().then(response => {
            const parsedResponse = JSON.parse(response);

            console.log("Hii " + parsedResponse.data.loginServiceProvider);

            if (parsedResponse.errors) {
                const errorMessage = parsedResponse.errors[0].message;
                alert(errorMessage);
            }
            else if (parsedResponse.data.loginServiceProvider == null) {
                alert("Log in failed! Please check your credentials");
            }
            else {

                handleLogin(parsedResponse.data.loginServiceProvider._id)
                // alert("Logged in successfully!");
                e.target.reset();
                navigate(`/serviceproviderhome`);
            }

        });

    }

    const registerNewUser = async (e) => {
        navigate(`/serviceproviderregister`);
    }


    return (


        <div>
            <h3 id="serprohead">Service Provider Portal</h3>

            <div class="twocolumnslogin">

                <div>
                    <img class="serprologinimg" src="servicepro1.jpg" ></img>
                </div>

                <Box component="form" id="loginServiceProviderform" name="loginServiceProviderform" onSubmit={loginServiceProvider} sx={{ '& .MuiTextField-root': { m: 1, width: '35ch' }, }} noValidate autoComplete="off" >

                    <div class="signupformdiv">

                        <h4 id="formhead">Service Provider Login</h4>

                        <TextField required id="username" type="text" label="User Name" name="username" helperText={errors.username} defaultValue={values.username} /> <br />

                        <TextField required id="password" type="password" label="Password" name="password" helperText={errors.password} defaultValue={values.password} /> <br />

                        <div>
                            <Button variant="contained" type="submit" class="registerbuttonstyle">Login me</Button>
                        </div>

                        <div>
                            <Button variant="outlined" type="button"  onClick={registerNewUser}>New user? Register!</Button>
                        </div>
                    </div>
                </Box>



            </div>
        </div>

    )

}

export default ServiceProviderLogin;