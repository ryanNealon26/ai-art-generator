import React from "react";
import Spinner from 'react-bootstrap/Spinner';
function LoadingWheel(){
    return(
        <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
          />
    );
}

export default LoadingWheel;