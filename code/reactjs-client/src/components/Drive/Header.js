// Header.js
import React from 'react';
import './css/header.css';
import SearchIcon from '@mui/icons-material/Search';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';

const Header = () => {
    return (
        <div className="header">
            <div className='header__logo'>
                <img src='https://cdn.icon-icons.com/icons2/3609/PNG/512/climate_forecast_weather_rain_storm_thunderstorm_thunder_icon_226629.png' alt="please enter the correct path"></img>
                <span>Work Drive</span>
            </div>
            <div className='header__search'>
                <SearchIcon />
                <input type='text' placeholder='Search in Drive' />
                <FormatAlignCenterIcon />
            </div>
            {/* Other header icons... */}
        </div>
    )
}

export default Header;
