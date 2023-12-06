import React, { useState, useEffect } from 'react';

const AdvancedSQL2 = () => {
    const [crimeStats, setCrimeStats] = useState([]);

    useEffect(() => {
        // Fetch data from your backend
        fetch('http://127.0.0.1:5000/storedProcedure')
            .then(response => response.json())
            .then(data => setCrimeStats(data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    return (
        <div>
            <h1>Crime Statistics by Hour</h1>
            <table>
                <thead>
                    <tr>
                        <th>Hour</th>
                        <th>Total Cases</th>
                        <th>Top Premise</th>
                        <th>Cases at Top Premise</th>
                        <th>Portion</th>
                        <th>Alert Level</th>
                    </tr>
                </thead>
                <tbody>
                    {crimeStats.map((stat, index) => (
                        <tr key={index}>
                        <td style={{ padding: '8px' }}>{stat.Hour}</td>
                        <td style={{ padding: '8px' }}>{stat.totalCase}</td>
                        <td style={{ padding: '8px' }}>{stat.top1Premis}</td>
                        <td style={{ padding: '8px' }}>{stat.top1cases}</td>
                        <td style={{ padding: '8px' }}>{stat.portion}</td>
                        <td style={{ padding: '8px' }}>{stat.rating}</td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AdvancedSQL2;
