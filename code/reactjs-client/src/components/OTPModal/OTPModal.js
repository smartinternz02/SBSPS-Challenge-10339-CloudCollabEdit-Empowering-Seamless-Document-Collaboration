import React, { Component } from 'react';

class OTPModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      otp: '',
    };
  }

  handleInputChange = (e) => {
    this.setState({ otp: e.target.value });
  };

  handleVerifyOTP = () => {
    // Send the OTP to the server for verification
    // You can use fetch or Axios to make a POST request to your Flask route
    fetch('/generate_otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ otp: this.state.otp }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'success') {
          // OTP verification was successful
          // Close the modal and handle success action
          this.props.onClose();
          // Handle success action (e.g., redirect or display a success message)
        } else {
          // OTP verification failed
          // Handle the error (e.g., display an error message)
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        // Handle network or other errors
      });
  };

  render() {
    return (
      <div className="modal">
        <div className="modal-content">
          <span className="close" onClick={this.props.onClose}>
            &times;
          </span>
          <h2>Enter OTP</h2>
          <input
            type="text"
            placeholder="Enter OTP"
            value={this.state.otp}
            onChange={this.handleInputChange}
          />
          <button onClick={this.handleVerifyOTP}>Verify OTP</button>
        </div>
      </div>
    );
  }
}

export default OTPModal;
