import React from "react";
import { MDBCol, MDBInput, MDBCardFooter} from "mdbreact";
import { MDBBtn, MDBCard, MDBCardBody, MDBBox, MDBCardTitle } from "mdbreact";
import "mdbreact/dist/css/mdb.css";


const signUpForm = () => {

    return (
        <div >

            <MDBBox display="flex" justifyContent="center" >
                <MDBCol className="my-5" md="5">
                    <MDBCard >
                        <MDBCardBody>
                            <MDBCardTitle><p className="h4 text-primary text-center py-4">Create An account</p></MDBCardTitle>
                            <form className="p-4 mt-4">
                                <div className="grey-text mx-2">
                                    <MDBInput
                                        label="enter your full name"
                                        icon="user"
                                        group
                                        type="text"
                                        validate
                                        error="wrong"
                                        success="right"
                                    />

                                    <MDBInput
                                        label="enter your email address"
                                        icon="envelope"
                                        group
                                        type="email"
                                        validate
                                        error="wrong"
                                        success="right"
                                    />

                                    <MDBInput
                                        label="enter your preferred password"
                                        icon="key"
                                        group
                                        type="password"
                                        validate
                                        error="wrong"
                                        success="right"
                                    />

                                    <MDBInput
                                        label="repeat the password"
                                        icon="key"
                                        group
                                        type="password"
                                        validate
                                        error="wrong"
                                        success="right"
                                    />

                                </div>
                                <div className="text-center py-4 mt-5">
                                    <MDBBtn color="primary" className="text-white">
                                        Sign Up
                                    </MDBBtn>

                                </div>
                            </form>


                        </MDBCardBody>
                        <MDBCardFooter className="justify-content-center font-italic text-center text-info">
                            <div>
                                <a href>I already have an account</a>
                            </div>
                        </MDBCardFooter>
                    </MDBCard>

                </MDBCol>


            </MDBBox>


        </div>
    );
};

export default signUpForm;
