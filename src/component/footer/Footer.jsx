import React from 'react';

function Footer() {

    const description = '© 2021 by Tim Shi for a better life';

    return (
        <div className="grid bg-indigo-700 text-white">
            <div className="col">
                <p className="text-right">{description}</p>  
            </div>
        </div>
    );
}

export default Footer