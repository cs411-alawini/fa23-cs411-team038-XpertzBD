import React, { useState } from 'react';

const Summary = () => {
    const [crimeSumm, setCrimeSumm] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerateSummary = () => {
        setIsLoading(true);
        fetch('http://127.0.0.1:5000/generateSummary1')
            .then(response => response.text())
            .then(data => {
                setCrimeSumm(data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error:', error);
                setIsLoading(false);
            });
    };

    return (
        <div>
            <h1>Crime Type Frequency Summary</h1>
            <button onClick={handleGenerateSummary} disabled={isLoading}>
                {isLoading ? 'Generating...' : 'Generate Summary using GPT3.5'}
            </button>
            {crimeSumm && (
                <div>
                    <h3>Generated Summary on AdvancedSQL1 Query Result</h3>
                    <p>{crimeSumm}</p>
                </div>
            )}
        </div>
    );
};

export default Summary;