# File Processing API

The File Processing API allows users to upload CSV or XML files for validation. The API is hosted at [http://ama-frontend.s3-website.eu-central-1.amazonaws.com/](http://ama-frontend.s3-website.eu-central-1.amazonaws.com/).

## Endpoints

### `POST /upload`

- Accepts files of types: 'csv' and 'xml'.
- Processes the file and returns validation results.

## Usage

1. **Upload a File:**

   - Visit [http://ama-frontend.s3-website.eu-central-1.amazonaws.com/](http://ama-frontend.s3-website.eu-central-1.amazonaws.com/) in your web browser.
   - Upload a file using the provided interface.

2. **Response:**
   - The API responds with a JSON object containing validation results.

## Project Structure

- `helpers.js`: Contains file reading and processing functions.
- `fileReaders.js`: Contains functions to convert CSV and XML records into javascript arrays.
- `server.js`: Sets up an Express server to handle file uploads and responses.
