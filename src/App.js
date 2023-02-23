import React, { useState, useEffect } from 'react';
import axios from "axios";
import { DataGrid, GridToolbar } from '@material-ui/data-grid';


//Columns to be displayed in the data table
const columns = [
  { field: 'name', headerName: 'Member Name', width: 250 },
  { field: 'type', headerName: 'Type of Absence', width: 200 },
  { field: 'startDate', headerName: 'Start Date', width: 200 },
  { field: 'endDate', headerName: 'End Date', width: 200 },
  { field: 'status', headerName: 'Status', width: 200 },
  { field: 'memberNote', headerName: 'Member Note', width: 400 },
  { field: 'admitterNote', headerName: 'Admitter Note', width: 400 },
];

//logic to display status
const generateStatus = (confirmedAt, rejectedAt) => {
  let status = "Requested";
  if (confirmedAt) {
    status = "Confirmed";
  } else if (rejectedAt) {
    status = "Rejected";
  }
  return status.toUpperCase()
};

//function to build the data table
export default function DynamicTable() {

 const [data, setData] = useState([]);
 const [loading, setLoading] = useState(true);

 //load the data from json files and map the required fields.
 useEffect(() => {

    axios.get('absences.json')
        .then(res => {
        setLoading(true);
        axios.get('members.json')
            .then(res1 => {
                try {
                        //deriving the Member Name for each row based on the userId
                        res.data.payload.map(absence => {
                        const member = res1.data.payload.find(member => member.userId === absence.userId);
                        absence.name = member.name;
                        //assigning the status using the function generateStatus based on confirmedAt and rejectedAt dates.
                        absence.status = generateStatus(absence.confirmedAt, absence.rejectedAt);
                      });
                      //set the data into data variable.
                      setData(res.data.payload);
                      setLoading(false);
                    } catch(err) {
                      alert('Exception while constructing the data, due to '+err);
                    }
            })
            .catch((err) => {
                alert('Exception while fetching the members data, due to '+err);
            })
    })
    .catch((err) => {
        alert('Exception while fetching the absences data, due to '+err);
    })
 }, [])

 //return the html for rendering datatable
 return (
    <center>
        <br/>
     <div style={{  align: 'center', height: 650, width: '95%'}}>
       <h3>
        Absence Manager
        <hr width="100%" color="black" />
       </h3>
       <DataGrid rows={data}
                 loading={loading}
                 columns={columns}
                 pageSize={10}
                 components={{
                   Toolbar: GridToolbar,
                 }}
       />
     </div>
     </center>
   );
}