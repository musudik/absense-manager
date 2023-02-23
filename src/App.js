import React, { useState, useEffect } from 'react';
import axios from "axios";
import { DataGrid } from '@material-ui/data-grid';
import { TablePagination } from '@mui/material/TablePagination';
import Paper from "@material-ui/core/Paper";
import SearchBar from "material-ui-search-bar";

const columns = [
  { field: 'name', headerName: 'Member Name', width: 250 },
  { field: 'type', headerName: 'Type of Absence', width: 200 },
  { field: 'startDate', headerName: 'Start Date', width: 200 },
  { field: 'endDate', headerName: 'End Date', width: 200 },
  { field: 'memberNote', headerName: 'Member Note', width: 400 },
  { field: 'confirmedAt', headerName: 'Status', width: 200 },
  { field: 'admitterNote', headerName: 'Admitter Note', width: 400 },
];


export default function DynamicTable() {
 const [loading, setLoading] = useState(true);
 const [data, setData] = useState([]);
 const [member, setMember] = useState([]);
 const [rows, setRows] = useState(data);
 const [searched, setSearched] = useState("");



 const currentRecords = data;
 const requestSearch = (searchedVal) => {

    axios.get('absences.json')
        .then(res => {
        axios.get('members.json')
            .then(res1 => {
                try {
                      res.data.payload.map(absence => {
                        const member = res1.data.payload.find(member => member.userId === absence.userId);
                        absence.name = member.name;
                      });
                      console.log("MAIN: "+res.data.payload);
                       setData(res.data.payload);
                       if (res.data.payload !== null ) {
                          const filteredRows = data.filter((row) => row.type.includes(searchedVal));
                           var arr = [];
                           Object.keys(filteredRows).forEach(function(key) {
                                arr.push(filteredRows[key]);
                           });
                           console.log("FILTER: "+arr);
                           setData(filteredRows);
                       }
                    } catch(err) {
                      alert('There was an error while constructing the absences data'+err);
                    }
            })
            .catch(() => {
                alert('There was an error while fetching the members data');
            })
    })
    .catch(() => {
        alert('There was an error while fetching the absences data');
    })

 };

 const cancelSearch = () => {
    setSearched("");
    requestSearch(searched);
 };

useEffect(() => {
    axios.get('absences.json')
        .then(res => {
        setLoading(true);
        axios.get('members.json')
            .then(res1 => {
                setLoading(false);
                try {
                      res.data.payload.map(absence => {
                        const member = res1.data.payload.find(member => member.userId === absence.userId);
                        absence.name = member.name;
                      });
                      setData(res.data.payload);
                    } catch(err) {
                      alert('There was an error while constructing the absences data'+err);
                    }
            })
            .catch(() => {
                alert('There was an error while fetching the members data');
            })
    })
    .catch(() => {
        alert('There was an error while fetching the absences data');
    })
 }, [])
 return (
    <center>
        <br/>
     <div style={{  align: 'center', height: 650, width: '95%'}}>
       <h3>
        Absence Manager
        <hr width="100%" color="black" />
       </h3>
       <SearchBar
            value={searched}
            onChange={(searchVal) => requestSearch(searchVal)}
            onCancelSearch={() => cancelSearch()}
          />
       <DataGrid rows={data}
                 columns={columns}
                 pageSize={10}
       />
     </div>
     </center>
   );
}