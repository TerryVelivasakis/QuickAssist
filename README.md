# QuickAssist

QuickAssist is a web application designed to streamline IT support requests by enabling users to submit help requests specific to their room or workstation. It features QR code generation for quick access to request forms, an admin dashboard for managing rooms, and a list of people who may need additional assistance.

## Features

- **Room-based Help Requests**: Users can scan a QR code for their room to submit a help request.
- **Admin Panel**: Allows IT admins to manage rooms, edit information, and track requests.
- **Dashboard**: Displays a quick overview of current and past help requests.
- **People Management** (Coming Soon): Track users who require more frequent assistance.
- **QR Codes**: Easily generate QR codes for each room for quick access.
  
## Technologies Used

- **Frontend**: React, Vite, Bootstrap
- **Backend**: Flask, Python
- **Database**: MongoDB
- **Socket Communication**: Flask-SocketIO
- **Containerization**: Docker

## Installation

### Prerequisites

Ensure you have the following installed:

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

### 1. Clone the repository

```bash
git clone https://github.com/TerryVelivasakis/QuickAssist.git
cd QuickAssist
```
### 2. Environment Variables
Create a `.env` file in the `flask` folder and define the following environment variables:
```bash
MONGO_URI=mongodb://<username>:<password>@<mongodb_server>:27017/
MONGO_CLIENT=supportApp
```
Replace `<username>`, `<password>`, and `<mongodb_server>` with your MongoDB credentials and server details.

### 3. Build and Run with Docker
To run the app in Docker containers, use Docker Compose:
This will build and run the frontend (`react-app`), backend (`flask-app`), and MongoDB (`mongodb`) services.

### 4. Access the App
Once the containers are up, access the following:

- Frontend: (http://localhost) or your server IP.
- Admin Panel: (http://localhost/admin)
- QR Codes: (http://localhost/qrcodes)

##Usage
###Admin Panel
The admin panel allows you to manage rooms, generate QR codes, and monitor submitted requests. You can access the admin panel at /admin.

###Dashboard
The dashboard provides a high-level overview of all current help requests.

###Submitting a Help Request
Each room is associated with a unique QR code that users can scan. After scanning, users are redirected to a room-specific help request form. They can fill out their issue and submit it directly to the IT team.

###Persistent Storage
The MongoDB database used by QuickAssist stores all room data, requests, and user information. Data persistence is maintained via Docker volumes, ensuring that no data is lost when the containers are stopped or removed.

###Automated Builds with Jenkins (Optional)
You can automate builds using Jenkins with webhooks. The app is set up to rebuild the containers and update the application when there is a new push to the repository.

###Contributing
If you would like to contribute to this project, feel free to open issues, submit pull requests, or suggest features.
