# Event Management App

This project is a web application built using the MERN stack (MongoDB, Express.js, React.js + Vite, Node.js) for adding, deleting, and editing events as well as ordering tickets for them. The application includes token authentication verification.

## Features

- **Add Events**: Users can add new events to the application, including details such as title, description, date, location, and available tickets.
- **Delete Events**: Users can remove events that are no longer relevant or needed.
- **Edit Events**: Users can update the details of existing events.
- **Order Tickets**: Users can browse available events and order tickets for those they are interested in.

## Authentication

- **Token Authentication**: The application implements token-based authentication. Users must log in to access the application's features. Upon logging in, users receive an authentication token (e.g., JWT - JSON Web Token).

## Technology Stack

- **MongoDB**: A NoSQL database for storing user, event, and ticket information.
- **Express.js**: A Node.js framework for building the server and API.
- **React.js + Vite**: A JavaScript library for building the user interface, with Vite providing fast and easy project setup and build tooling.
- **Node.js**: A JavaScript runtime environment for server-side programming.

## Installation and Setup

### Clone the repository:

```bash
git clone https://github.com/yourusername/event-management-app.git
cd event-management-app
```

### Install server dependencies:

```bash
cd server
npm install
```

### Install client dependencies:

```bash
cd ../client
npm install
```

### Configure environment variables:

Create a .env file in the server directory and add your MongoDB URI, JWT secret, and other necessary configuration.

### Run the application:

* Start the server:
```bash
cd server
npm start
```

* Start the client:
```bash
cd ../client
npm run dev
```

### Access the application:

Open your browser and go to http://localhost:5173.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any bugs or improvements.

## License

This project is licensed under the MIT License.
