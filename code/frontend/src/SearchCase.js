import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

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

    
const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this case?')) {
        try {
            const response = await fetch(`http://127.0.0.1:5000/delete_case/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            setSearchResults(prevResults => prevResults.filter(item => String(item[1]) !== String(id)));
        } catch (error) {
            console.error('Error deleting the case:', error);
            alert('Error deleting the case. Please try again.');
        }
    }
};

const [updatingCase, setUpdatingCase] = useState(null);
const [showUpdateForm, setShowUpdateForm] = useState(false);

   
const handleUpdateClick = (caseData) => {
    setUpdatingCase(caseData);
    setShowUpdateForm(true);
};

const handleUpdateSubmit = async (e, caseId) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedData = {
        Date_OCC: formData.get('Date_OCC'),
        Time_OCC: formData.get('Time_OCC'),
        PremisDesc: formData.get('PremisDesc'),
        Judge_Status_desc: formData.get('Judge_Status'),
        LAT: formData.get('LAT'),
        LON: formData.get('LON'),
        Weapon_Desc: formData.get('Weapon_Desc'),
        Modus_operandi: formData.get('Modus_operandi'),
        Crime_Desc: formData.get('Crime_Desc')
    };

    console.log('Updated Data:', updatedData);

    try {
        
        const response = await fetch(`http://127.0.0.1:5000/update_case/${caseId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        setShowUpdateForm(false);
        setUpdatingCase(null); 
        handleSearch(new Event('submit')); 
    } catch (error) {
        console.error('Error updating the case:', error);
    }
};



const renderUpdateForm = () => {
    if (!showUpdateForm || !updatingCase) return null;
    return (
        <div className="modal show fade" style={{ display: 'block' }} tabIndex="-1">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Update Case</h5>
                        <button type="button" className="btn-close" onClick={() => setShowUpdateForm(false)}></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={(e) => handleUpdateSubmit(e, updatingCase[1])}> 
                            <div className="mb-3">
                                <label htmlFor="Date_OCC" className="form-label">Date:</label>
                                <input type="text" className="form-control" name="Date_OCC" defaultValue={updatingCase[3]} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="Time_OCC" className="form-label">Time:</label>
                                <input type="text" className="form-control" name="Time_OCC" defaultValue={updatingCase[4]} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="PremisDesc" className="form-label">Premis:</label>
                                <input type="text" className="form-control" name="PremisDesc" defaultValue={updatingCase[6]} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="Judge_Status" className="form-label">Judge:</label>
                                <input type="text" className="form-control" name="Judge_Status" defaultValue={updatingCase[8]} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="LAT" className="form-label">LAT:</label>
                                <input type="text" className="form-control" name="LAT" defaultValue={updatingCase[13]} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="LON" className="form-label">LON:</label>
                                <input type="text" className="form-control" name="LON" defaultValue={updatingCase[14]} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="Modus_operandi" className="form-label">Modus_operandi:</label>
                                <input type="text" className="form-control" name="Modus_operandi" defaultValue={updatingCase[22]} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="Weapon_Desc" className="form-label">Weapon:</label>
                                <input type="text" className="form-control" name="Weapon_Desc" defaultValue={updatingCase[20]} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="Crime_Desc" className="form-label">Crime:</label>
                                <input type="text" className="form-control" name="Crime_Desc" defaultValue={updatingCase[23]} />
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowUpdateForm(false)}>Close</button>
                                <button type="submit" className="btn btn-primary">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
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


            {/* <div>
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
            </div> */}
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
                        {searchResults.map((item, index) => {
                            console.log(item); // 这里打印每个item对象
                            return (
                                <tr key={index}>
                                    {Object.entries(item)
                                        .filter((_, idx) => [1, 3, 4, 6, 8, 13, 14, 20, 22, 23].includes(idx))
                                        .map(([key, value], idx) => (
                                            <td key={idx}>{value}</td>
                                        ))}
                                    <td>
                                        <button onClick={() => handleUpdateClick(item)}>Update</button>
                                        <button onClick={() => handleDelete(item[1])}>Delete</button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            {renderUpdateForm()}

        </div>
    );
}

export default SearchCase;
