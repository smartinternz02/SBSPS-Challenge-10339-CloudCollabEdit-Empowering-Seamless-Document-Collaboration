import React, { Component } from 'react';
import OTPModal from './OTPModal';

class MainComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      userEmail: '',
    };
  }

  handleShowModal = () => {
    this.setState({ showModal: true });

    const { userEmail } = this.state;

    // Send a POST request to the Flask backend to generate OTP
    fetch('/generate_otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: 'jeyanthvijay2000@gmail.com' }), // Pass email as JSON
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'success') {
          // OTP sent successfully, open the modal
          this.setState({ showModal: true });
        } else {
          // Handle error (e.g., display an error message)
          console.error(data.message);
        }
      })
      .catch((error) => {
        // Handle network or other errors
        console.error('Error:', error);
      });
  };

  handleCloseModal = () => {
    this.setState({ showModal: false });
  };

  handleEmailChange = (e) => {
    this.setState({ userEmail: e.target.value });
  };

  render() {
    return (
      <div>
        {/* Your main content */}
        <input
          type="text"
          placeholder="Enter your email"
          value={this.state.userEmail}
          onChange={this.handleEmailChange}
        />
        <button onClick={this.handleShowModal}>Request OTP</button>

        {this.state.showModal && (
          <OTPModal onClose={this.handleCloseModal} />
        )}
      </div>
    );
  }
}

export default MainComponent;
