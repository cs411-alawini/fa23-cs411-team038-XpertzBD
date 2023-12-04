import React, { useState } from 'react';

function SearchCase() {
    const [searchQuery, setSearchQuery] = useState({
        LAT: '',
        LON: '',
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
        1: 'Dr_ID',
        3: 'Date_OCC',
        4: 'Time_OCC',
        6: 'PremisDesc',
        8: 'Judge_Status',
        13: 'LAT',
        14: 'LON',
        20: 'Weapon_Desc',
        22: 'Modus_operandi',
        23: 'Crime_Desc'
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

                <label htmlFor="Date">Date:</label>
                <input
                    name="Date"
                    value={searchQuery.Date}
                    onChange={handleChange}
                    placeholder="e.g., 1/3/21"
                />
                <br />

                <label htmlFor="Time">Time:</label>
                <input
                    name="Time"
                    value={searchQuery.Time}
                    onChange={handleChange}
                    placeholder="e.g., 1440 or 330"
                />
                <br />

                <label htmlFor="Premis">Premis:</label>
                <input
                    name="Premis"
                    value={searchQuery.Premis}
                    onChange={handleChange}
                />
                <br />

                <label htmlFor="Judge">Judge:</label>
                <select
                    name="Judge"
                    value={searchQuery.Judge}
                    onChange={handleChange}
                >
                    <option value="">Select a Judge status</option>
                    <option value="Adult Arrest">Adult Arrest</option>
                    <option value="Invest Cont">Invest Cont</option>
                    <option value="Adult Other">Adult Other</option>
                </select>
                <br />
                
                {/* <label htmlFor="Modus_operandi">Modus_operandi:</label>
                <input
                    name="Modus_operandi"
                    value={searchQuery.Modus_operandi}
                    onChange={handleChange}
                />
                <br /> */}

                {/* <label htmlFor="LAT">LAT:</label>
                <input
                    name="LAT"
                    value={searchQuery.LAT}
                    onChange={handleChange}
                    placeholder="e.g., 33.8498"
                />
                <br />

                <label htmlFor="LON">LON:</label>
                <input
                    name="LON"
                    value={searchQuery.LON}
                    onChange={handleChange}
                    placeholder="e.g., -118.293"
                />
                <br /> */}

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


            <div>
                <h2>Search Results</h2>
                <strong>{searchResults.length} records found</strong>
                <table>
                    <thead>
                        <tr>
                            {Object.keys(searchResults[0] || {}).filter((_, idx) => [1, 3, 4, 6, 8, 13, 14, 20, 22, 23].includes(idx))
                                .map((key, idx) => <th key={idx}>{keyMappings[key] || key}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {searchResults.map((item, index) => (
                            <tr key={index}>
                                {Object.entries(item)
                                    .filter((_, idx) => [1, 3, 4, 6, 8, 13, 14, 20, 22, 23].includes(idx))
                                    .map(([key, value], idx) => (
                                        <td key={idx}>{value}</td>
                                    ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>






        </div>
    );
}

export default SearchCase;
