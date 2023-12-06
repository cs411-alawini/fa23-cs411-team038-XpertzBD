import React, { useState, useEffect } from 'react';

const AdvancedSQL1 = () => {
    const [crimes, setCrimes] = useState([]);

    useEffect(() => {
        // Fetch data from your backend
        fetch('http://127.0.0.1:5000/advancedSQL1')
            .then(response => response.json())
            .then(data => setCrimes(data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    const handleSummarize = async () => {
        // ... summary function implementation
    };

    return (
        <div>
            <h1>Crime Frequency List</h1>
            {/* <button onClick={handleSummarize}>Use GPT to Summarize Data</button> */}
            {/* {summary && <div><h3>Summary</h3><p>{summary}</p></div>} */}
            <table>
                <thead>
                    <tr>
                        <th>Crime Code</th>
                        <th>Description</th>
                        <th>Frequency</th>
                    </tr>
                </thead>
                <tbody>
                    {crimes.map((crime, index) => (
                        <tr key={index}>
                            <td>{crime.crm_cd}</td>
                            <td>{crime.Crm_cd_desc || 'No Description'}</td>
                            <td>{crime.frequency}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AdvancedSQL1;
