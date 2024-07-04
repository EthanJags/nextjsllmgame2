import React, { useState } from 'react';

const Responding: React.FC = () => {
    const [text, setText] = useState('');
    const maxWordLimit = 100;

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(event.target.value);
    };

    return (
        <div>
            <h1>Responding Screen</h1>
            <h2>Question:</h2>
            <textarea
                value={text}
                onChange={handleChange}
                placeholder={`Enter your response (max ${maxWordLimit} words)`}
                maxLength={maxWordLimit}
                rows={5}
                cols={50}
            />
        </div>
    );
};

export default Responding;