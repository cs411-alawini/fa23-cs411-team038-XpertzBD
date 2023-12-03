import React, { useState } from 'react';

function SearchCase() {
    const [searchQuery, setSearchQuery] = useState({
        Location: '',
        Date: '',
        WeaponType: '',
        CrimeType: '',
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

    const keyMappings = {
        0: 'Dr_ID',
        1: 'Date_Rptd',
        2: 'Date_OCC',
        3: 'Time_OCC',
        4: 'Part1_2',
        5: 'Crm_cd',
        6: 'PremisDesc',
        7: 'Weapon_Used_cd',
        8: 'Judge_Status',
        9: 'Crm_cd1',
        10: 'Crm_cd2',
        11: 'Crm_cd3',
        12: 'Crm_cd4',
        13: 'LAT',
        14: 'LON',
        15: 'Mocode1',
        16: 'Mocode2',
        17: 'Mocode3',
        18: 'UserId'
    };

    const [searchResults, setSearchResults] = useState([]);

    const handleChange = (e) => {
        setSearchQuery({ ...searchQuery, [e.target.name]: e.target.value });
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        const queryParams = new URLSearchParams(searchQuery).toString();

        try {
            const response = await fetch(`http://127.0.0.1:5000/search?${queryParams}`, {
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setSearchResults(data);
        } catch (error) {
            console.error('Error searching the cases:', error);
            alert('Error searching the cases. Please try again.');
        }
    };

    return (
        <div>
            <h1>Search Cases</h1>
            <form onSubmit={handleSearch}>
                <label htmlFor="Location">Location:</label>
                <input
                    type="text"
                    name="Location"
                    value={searchQuery.Location}
                    onChange={handleChange}
                />
                <br />

                <label htmlFor="Date">Date:</label>
                <input
                    type="Date"
                    name="Date"
                    value={searchQuery.Date}
                    onChange={handleChange}
                />
                <br />

                <label htmlFor="WeaponType">Weapon:</label>
                <select
                    name="WeaponType"
                    value={searchQuery.WeaponType}
                    onChange={handleChange}
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
                    value={searchQuery.CrimeType}
                    onChange={handleChange}
                >
                    <option value="">Select a Crime</option>
                    {crimeOptions.map((crime, index) => (
                        <option key={index} value={crime}>{crime}</option>
                    ))}
                </select>
                <br />
                <button type="submit">Search</button>
            </form>

            {/* <div>
                <h2>Search Results</h2>
                <strong>{searchResults.length} records found</strong>
                {searchResults.map((item, index) => (
                    <pre key={index}>
                        {Object.entries(item)
                            .filter(([key, value]) => value != null)
                            .map(([key, value]) => (
                                <span key={key}><u>{keyMappings[key] || key}</u>: {value}</span>
                            ))
                            .reduce((acc, span, idx, array) => idx < array.length - 1 ? [...acc, span, ', '] : [...acc, span], [])}
                    </pre>
                ))}
            </div> */}

<div>
    <h2>Search Results</h2>
    <strong>{searchResults.length} records found</strong>
    {searchResults.map((item, index) => (
        <pre key={index}>
            {Object.entries(item)
                .filter((_, idx) => [0, 1, 2, 3, 5, 6, 7, 8, 13, 14, 15, 16, 17].includes(idx))
                .map(([key, value]) => (
                    <span key={key}><u><strong>{keyMappings[key] || key}</strong></u>: {value}</span>
                ))
                .reduce((acc, span, idx, array) => idx < array.length - 1 ? [...acc, span, ', '] : [...acc, span], [])}
        </pre>
    ))}
</div>





        </div>
    );
}

export default SearchCase;
