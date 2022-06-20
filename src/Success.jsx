import React from 'react';

const SuccessPage = () => {

    // button onlick function
    const handleClick = () => {
        window.location.href = '/'
    }

    return (
        <div className='success_page_container'> 
            <p>You have successfully logged out.</p>
            <button onClick={handleClick}>Click here to continue..</button>
        </div>
    );
}

export default SuccessPage;