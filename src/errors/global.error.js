import CustomError from "./custom.error.js";

const globalError = (err, req, res, next) => {
  if (err instanceof CustomError) {

    const response = {
      status: err.status,
      message: err.message
    };
    
    // Include validation details if they exist
    if (err.details) {
      response.errors = err.details;
    }
    
    res.status(err.statusCode).json(response);
    return;
  }
  
  
  res.status(500).json({
    status: false,
    message: `Oops... Something Went Wrong`,
    error: process.env.NODE_ENV !== 'production' ? err.message : '',
    stack: process.env.NODE_ENV !== 'production' ? err.stack : ''
  });
};

export default globalError;