import React, { useState, useEffect } from 'react';

const AdvancedSQL2 = () => {
    const [crimeStats, setCrimeStats] = useState([]);

    useEffect(() => {
        // Fetch data from your backend
        fetch('http://127.0.0.1:5000/advancedSQL2')
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
                    </tr>
                </thead>
                <tbody>
                    {crimeStats.map((stat, index) => (
                        <tr key={index}>
                            <td>{stat.Hour}</td>
                            <td>{stat.totalCase}</td>
                            <td>{stat.top1Premis}</td>
                            <td>{stat.top1cases}</td>
                            <td>{stat.portion}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AdvancedSQL2;
