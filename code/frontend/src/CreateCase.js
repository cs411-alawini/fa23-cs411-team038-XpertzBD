// CreateCase.js
import React, { useState } from 'react';
import { useAuth } from './AuthContext';

function CreateCase() {
    const auth = useAuth(); // Use the useAuth hook

    const [caseDetails, setCaseDetails] = useState({
        Location: '',
        Date: '',
        WeaponType: '',
        CrimeType: '',
        Time: '',
        Premis: '',
        Judge_stat: '',
    });

    const weaponOptions = [
        'Shot Gun',
        'Hand Gun',
        'Unknown FireArm',
        'Kitchen Knife',
        'Folding Knife',
        'Unknown Knife',
        'Hammer',
        'Physical',
    ];

    const crimeOptions = [
        'Robbery',
        'Homicide',
        'Burglary',
        'Stalking',
        'Drug',
        'Kidnapping',
        'Trespassing',
        'Shooting',
        'Theft',
    ];

    const handleChange = (e) => {
        setCaseDetails({ ...caseDetails, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log('login status: ', auth.isLoggedIn)

        // Check if the user is logged in
        if (!auth.isLoggedIn) {
            alert('You must be logged in to report a case.');
            return;
        }


        // Get the token from localStorage
        const token = localStorage.getItem('access_token');
        if (!token) {
            alert('No authentication token found. Please log in again.');
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:5000/create', {
                method: 'POST',
                headers: {
                    'content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(caseDetails),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            const data = await response.json();
            console.log(data);
            alert('Case reported successfully!');
        } catch (error) {
            console.error('Error submitting the case:', error);
            alert('Error submitting the case. Please try again.');
        }
    };

    return (
        <div>
            <h1>Create a New Case</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="Location">Location:</label>
                <input
                    type="text"
                    name="Location"
                    value={caseDetails.Location}
                    onChange={handleChange}
                    required
                />
                <br />

                <label htmlFor="Date">Date:</label>
                <input
                    type="Date"
                    name="Date"
                    value={caseDetails.Date}
                    onChange={handleChange}
                    required
                />

                <br />

                <label htmlFor="Time">Time:</label>
                <input
                    type="text"
                    name="Time"
                    value={caseDetails.Time}
                    onChange={handleChange}
                    required
                />
                <br />

                <label htmlFor="Premis"> Premis - Place of crime:</label>
                <input
                    type="text"
                    name="Premis"
                    value={caseDetails.Premis}
                    onChange={handleChange}
                    placeholder="e.g., STREET"
                    required
                />
                <br />

                <label htmlFor="Judge"> Judge Status:</label>
                <select
                    name="Judge"
                    value={caseDetails.Judge}
                    onChange={handleChange}
                >
                    <option value="">Select a Judge status</option>
                    <option value="Adult Arrest">Adult Arrest</option>
                    <option value="Invest Cont">Invest Cont</option>
                    <option value="Adult Other">Adult Other</option>
                </select>
                <br />

                <label htmlFor="WeaponType">Weapon:</label>
                <select
                    name="WeaponType"
                    value={caseDetails.WeaponType}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select a Weapon</option>
                    {weaponOptions.map((weapon, index) => (
                        <option key={index} value={weapon}>{weapon}</option>
                    ))}
                </select>
                <br />
                <label htmlFor="CrimeType">Crime:</label>
                <select
                    name="CrimeType"
                    value={caseDetails.CrimeType}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select a Crime</option>
                    {crimeOptions.map((crime, index) => (
                        <option key={index} value={crime}>{crime}</option>
                    ))}
                </select>
                <br />
                {/* Add more input fields as needed */}
                <button type="submit">Report Case</button>
            </form>
        </div>
    );
}

export default CreateCase;
