import React from 'react'
import { styled } from '@mui/material/styles';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import "./data.css"

const Data = ({ files }) => {
    const truncateFileName = (name) => {
        if (name.length > 10) {
          return name.slice(0, 20) + '...';
        }
        return name;
      };

      const LightTooltip = styled(({ className, ...props }) => (
        <Tooltip {...props} classes={{ popper: className }} />
      ))(({ theme }) => ({
        [`& .${tooltipClasses.tooltip}`]: {
          backgroundColor: theme.palette.common.white,
          color: 'rgba(0, 0, 0, 1)',
          boxShadow: theme.shadows[1],
          fontSize: 15,
        },
      }));
      
    return (
        <>
            <div className='datap'>
                <table>
                    <thead>
                        <tr>
                            <th id="h1">Name <ArrowDownwardIcon/></th>
                            <th id="h2">Document Code</th>
                            <th id="h3">Created At</th>
                            <th id="h4">Last Modified</th>
                        </tr>
                    </thead>
                    <tbody>
                        {files.map((file) => (
                            <tr key={file._id}>
                                <td id="d1">
                                    <InsertDriveFileIcon />
                                    <LightTooltip title={file.name} placement="top">
                                    <Link
                                        to={`/document/${file._id}?name=${encodeURIComponent(file.name)}`}
                                    >
                                        {truncateFileName(file.name)}
                                    </Link>
                                    </LightTooltip>
                                </td>
                                <td id="h2">
                                    <LightTooltip title={`${file._id}?name=${encodeURIComponent(file.name)}`} placement="top">
                                    <Link
                                        to={`/document/${file._id}?name=${encodeURIComponent(file.name)}`}
                                    >
                                        {truncateFileName(`${file._id}?name=${encodeURIComponent(file.name)}`)}
                                    </Link>
                                    </LightTooltip>
                                </td>
                                <td id="h3">{file.createdAt}</td>
                                <td id="h4">{file.lastModified}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default Data
