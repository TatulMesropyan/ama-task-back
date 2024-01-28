# File Processing API

The File Processing API allows users to upload CSV or XML files for validation. The FE is hosted at [http://test-frontend.s3-website.eu-central-1.amazonaws.com/](http://ama-frontend.s3-website.eu-central-1.amazonaws.com/).

## Technologies Used

### Express.js

The API is built using [Express.js](https://expressjs.com/), a fast, minimalist web framework for Node.js. Express.js simplifies the process of building web applications and APIs.

### AWS Lambda

The application is deployed on [AWS Lambda](https://aws.amazon.com/lambda/), a serverless computing service. AWS Lambda allows running code without provisioning or managing servers, providing a scalable and cost-effective solution. You can access the API through the following link: [AWS Lambda API](https://qaweu2uksazg4d6iu2sbltou7i0ldcvl.lambda-url.eu-central-1.on.aws/)

### GitHub Actions

[GitHub Actions](https://github.com/features/actions) is utilized for CI/CD. The workflow includes steps for dependency installation, deployment, and AWS Lambda update.

## Endpoints

### `POST /upload`

- Accepts files of types: 'csv' and 'xml'.
- Processes the file and returns validation results.

## Usage

1. **Upload a File:**

   - Visit [http://test-frontend.s3-website.eu-central-1.amazonaws.com/](http://test-frontend.s3-website.eu-central-1.amazonaws.com/) in your web browser.
   - Upload a file using the provided interface.

2. **Response:**
   - The API responds with a JSON object containing validation results.

## Project Structure

- `helpers.js`: Contains file reading and processing functions.
- `fileReaders.js`: Contains functions to convert CSV and XML records into javascript arrays.
- `server.js`: Sets up an Express server to handle file uploads and responses.
- `validators.js`: Contains validation logic for uploaded files.

## CI/CD with GitHub Actions

The project includes a CI/CD workflow using GitHub Actions. The workflow is triggered on pushes and pull requests to the `main` branch.

### Workflow Steps:

1. **Checkout repository:**

   - Uses the `actions/checkout` action to fetch the repository.

2. **Set up Node.js:**

   - Uses the `actions/setup-node` action to set up Node.js with the specified version.

3. **Prepare dependencies:**

   - Runs the `make init` command to install project dependencies using npm.

4. **Deploy to AWS Lambda:**
   - Runs the `make deploy` command to package the application and deploy it to AWS Lambda.
   - Uses AWS credentials stored as GitHub secrets for authentication.
     - `AWS_ACCESS_KEY_ID`: Access key for AWS.
     - `AWS_SECRET_ACCESS_KEY`: Secret key for AWS.
