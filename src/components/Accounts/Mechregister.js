import React from "react";
import { 
    MDBCol, 
    MDBInput, 
    MDBIcon,
    MDBBtn,
    MDBBox, 
    } from "mdbreact";
import {Input} from "antd";
import "antd/dist/antd.css";
import { gql, useMutation } from '@apollo/client';




const CREATE_MECHANIC = gql`
    mutation createMechanic( $email: String!, $password: String!, $phoneNumber: String!, $fullName: String!, $company_name : String!, $company_img: String!, 
        $company_relative_location: String, $company_absolute_location: [Float]) {
        createMechanic(mechanicInput: {email: $email , password: $password, phoneNumber:$phoneNumber, fullName: $fullName, company_name: $company_name, 
            company_img: $company_img, company_relative_location: $company_relative_location, company_absolute_location: $company_absolute_location}){
            fullName,
            accountType
            company_name
        }
    }
`;



    const MechRegister = (props) => {



        const [loading, setLoading] = React.useState(false);
        const [fileState, setFileState] = React.useState({});
        const [addMechanic, { data }] = useMutation(CREATE_MECHANIC);

        const handleFileUpload = (e) => {

            const reader = new FileReader();
            const file = e.target.files[0];
            reader.onloadend = () => {
                 setFileState(reader.result);
            };
            reader.readAsDataURL(file);
            setFileState(file);
         };

        const gotoTypes = () => {
            props.typeCallback();
        };

        const testFunction = (e) => {

            var userName = document.getElementById("username").value;
            var email = document.getElementById("email").value;
            var password = document.getElementById("password").value;
            var location = document.getElementById("relativeLocation").value;
            var companyName = document.getElementById("companyName").value;
            var phoneNumber = document.getElementById("phoneNumber").value;

            navigator.geolocation.getCurrentPosition((position) => {
                const userCoordinates = [position.coords.longitude, position.coords.latitude];

                //e.preventDefault();
                addMechanic({variables: {email: email , password: password, phoneNumber: phoneNumber, fullName: userName, company_name: companyName,
                        company_img: fileState, company_relative_location: location, company_absolute_location: userCoordinates[0]}})
                    .then((r) => {
                        console.log(r);
                    }).catch((error) => {
                        console.log(error);
                });
             });


        }

        const handleCreateMechanic = () => {

            setLoading(true);

            var userName = document.getElementById("username").value;
            var email = document.getElementById("email").value;
            var password = document.getElementById("password").value;
            var location = document.getElementById("relativeLocation").value;
            var companyName = document.getElementById("companyName").value;
            var phoneNumber = document.getElementById("phoneNumber").value;
            //console.log(fileState);
            //console.log(userName, password, location, companyName, phoneNumber);

            if(userName.length === 0 || email.length === 0 || password.length === 0 || companyName.length === 0
                || phoneNumber.length === 0 || fileState.length === 0 || location.length === 0){
                setLoading(false);
                alert("Some fields cannot be left empty!");
            } else {

                navigator.geolocation.getCurrentPosition((position) => {
                    const userCoordinates = [position.coords.longitude, position.coords.latitude];

                    //console.log(userCoordinates);

                    const request = {
                        query:`
                        mutation {
                              createMechanic(mechanicInput: {email: "${email}", password: "${password}", 
                                  phoneNumber:"${phoneNumber}", fullName: "${userName}", company_name: "${companyName}", company_img:"${fileState}", 
                                  company_relative_location: "${location}", company_absolute_location: ${userCoordinates[0]}}){
                                fullName,
                                accountType
                                company_name
                              }
                            }
                            `
                    };
                    fetch("https://secret-citadel-57463.herokuapp.com/graphql", {
                        method: "POST",
                        body: JSON.stringify(request),
                        headers:{
                            "content-type":"application/json"
                        }
                    })
                        .then((result) => {
                            setLoading(false);
                            if(!result.status === 200 || !result.status === 201){
                                throw new Error("failed!");
                            } else {
                                alert("Mechanic was created successfully" );
                                gotoTypes();
                            }

                            return result.json();
                        }).then((resData) => {
                        //console.log(resData)
                        })
                        .catch((error) => {
                            setLoading(false);
                            alert("Oops! an error occurred : " + error);
                        });

                });


            }


        };

        const handleAccountExists = () => {
            props.accountCallback();
        };



        return (
            <MDBBox display="flex" className="w-100" justifyContent="center" >
                <MDBCol className="w-100">
                    <div>
                        <MDBBtn color="primary" onClick={gotoTypes} className="float-left mx-1 mb-3">
                            <MDBIcon icon="angle-double-left" className="white-text" size="1x"/>
                        </MDBBtn><h5 className="h4 mx-1 text-primary text-center">Mechanic Account</h5>
                    </div>
                    <form className="mt-5 mx-2 grey-text">
                        <div className="md-form d-flex flex-column justify-content-center align-items-center mt-2 mx-1">
                            <Input type="file"
                                   style={{ width: "50%" }}
                                   accept="image/*"
                                   onChange={handleFileUpload}
                                   size="large"
                                   placeholder="Select profile Image" prefix={<MDBIcon icon="user-plus"/>} />
                            {/* <p className="font-italic">{fileState.name}</p> */}
                        </div>
                        <MDBInput
                            label="enter your user name"
                            id="username"
                            icon="user"
                            group
                            type="text"
                            validate
                            outline
                            error="wrong"
                            success="right"
                        />

                        <MDBInput
                            label="enter your email"
                            id="email"
                            icon="envelope"
                            group
                            type="email"
                            validate
                            outline
                            error="wrong"
                            success="right"
                        />

                        <MDBInput
                            label="enter your phone number"
                            icon="phone-alt"
                            id="phoneNumber"
                            group
                            type="number"
                            validate
                            outline
                            error="wrong"
                            success="right"
                        />

                        <MDBInput
                            label="enter your garage name"
                            icon="building"
                            id="companyName"
                            group
                            type="text"
                            validate
                            outline
                            error="wrong"
                            success="right"
                        />

                        <MDBInput
                            label="enter your garage location e.g City, Area"
                            icon="map-marker-alt"
                            id="relativeLocation"
                            group
                            type="text"
                            validate
                            outline
                            error="wrong"
                            success="right"
                        />

                        <MDBInput
                            label="enter your preferred password"
                            icon="key"
                            id="password"
                            group
                            type="password"
                            validate
                            outline
                            error="wrong"
                            success="right"
                        />

                        <div className="text-center py-4 mt-5">
                            <MDBBtn color="primary" onClick={() => {handleCreateMechanic()}} className="text-white">
                                Register
                                {loading ? <div className="spinner-border ml-2 spinner-border-sm" role="status">
                                    <span className="sr-only">Loading...</span>
                                </div> : null }
                            </MDBBtn>
                        </div>
                    </form>

                    <hr/>
                    <div className="text-center font-italic text-primary">
                        <a onClick={handleAccountExists}>I already have an account</a>
                    </div>
                </MDBCol>


            </MDBBox>
        );
    };


    export default MechRegister;