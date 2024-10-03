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
Create a .env file in the flask folder and define the following environment variables:
```bash
MONGO_URI=mongodb://<username>:<password>@<mongodb_server>:27017/
MONGO_CLIENT=supportApp
```
Replace <username>, <password>, and <mongodb_server> with your MongoDB credentials and server details.

### 3. Build and Run with Docker
To run the app in Docker containers, use Docker Compose:
