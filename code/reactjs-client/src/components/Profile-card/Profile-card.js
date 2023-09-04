import React from "react";
import "./ProfileCard.css";

function ProfileCard(props) {
    return (
        <div className="card1">
            <div className="left">
                <header className="imagee">
                <img src="https://img.freepik.com/premium-vector/user-profile-icon-flat-style-member-avatar-vector-illustration-isolated-background-human-permission-sign-business-concept_157943-15752.jpg" alt={props.name} />
                </header>
                
            </div>
            <div className="right">
                <center>
                    <h1 className="bold-text">Name : {props.name} </h1>
                    <h1 className="bold-text">E-Mail : {props.mail}</h1>
                    <button
                    className="profile-button"
                    onClick={() => {
                    props.onCreateDocumentClick();
                    }}>Create a Document</button>

                    <button
                    className="profile-button"
                    onClick={() => {
                    props.onEnterDocumentClick();
                    }}>Enter Document Code</button>
                </center>
            </div>
        </div>
    );
}

export default ProfileCard;
