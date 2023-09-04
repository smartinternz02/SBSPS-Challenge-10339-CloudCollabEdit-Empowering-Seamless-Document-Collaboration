import React from 'react';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import Carousel from './CarouselComponent';
import "./card.css"
// import Sidebar from '../components/Sidebar/Sidebar';

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  padding: '16px', // Add padding for better spacing on small screens
  boxSizing: 'border-box', // Ensure padding is included in element's size
};

const loginButtonStyle = {
  marginTop: '16px', // You can adjust the spacing as needed
};
const Card = ({ title, content, imageUrl }) => (
  <div className='card'>
    {imageUrl && <img src={imageUrl} className="image" alt={title} />}
    <h2>{title}</h2>
    <p>{content}</p>
  </div>
);  
// const CARDS = 2
const cardData = [
  {
    imageUrl :'https://convergence.io/assets/img/convergence-overview.jpg',
    title: 'Custom Card Title 1',
    content: 'Custom content for Card 1 goes here.',
  },
  {
    imageUrl: '',
    title: 'Custom Card Title 2',
    content: 'Custom content for Card 2 goes here.',
  },
  {
    title: 'Custom Card Title 2',
    content: 'Custom content for Card 2 goes here.',
  },
  {
    title: 'Custom Card Title 2',
    content: 'Custom content for Card 2 goes here.',
  },
  {
    title: 'Custom Card Title 2',
    content: 'Custom content for Card 2 goes here.',
  },
  // Add more card data as needed
];
const Home = () => {

    const navigate = useNavigate();
    const loginClick=()=>{
        navigate('/logster');
    }
  return (
    <div style={containerStyle} className='dcf'>
      {/* <Sidebar />s */}
      <h1 style={{textAlign:'center', color: 'black'}}>Welcome to the<br/> Home Page</h1>
      <Button
        variant="contained"
        color="primary"
        style={loginButtonStyle}
        onClick={loginClick}
      >
        Login
      </Button>
      <br></br>
      <div className="app">
        <Carousel>
          {cardData.map((card, index) => (
            <Card
              key={index} 
              imageUrl={card.imageUrl}
              title={card.title}
              content={card.content}
            />
          ))}
        </Carousel>
      </div>
    </div>
  );
}

export default Home;
