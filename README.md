# Solar ROI Calculator and Admin Dashboard

## Overview

This project consists of two main components:

1. **Solar ROI Calculator**: An accessible tool to estimate the return on investment (ROI) for solar installations, factoring in savings, payback period, and financial projections.
2. **Admin Dashboard**: A secure interface for managing energy components such as generators, inverters, and solar charge controllers, with full CRUD (Create, Read, Update, Delete) functionality.

## Table of Contents

- [Project Structure](#project-structure)
- [Features](#features)
- [Setup and Installation](#setup-and-installation)
- [API Endpoints](#api-endpoints)
- [Usage](#usage)
- [License](#license)

## Project Structure

The project is structured as follows:

- **Frontend**: HTML, CSS, and JavaScript to create a user-friendly UI, styled with Notion-inspired design.
- **Backend**: Node.js and Express.js server providing RESTful APIs for CRUD operations and ROI calculations.
- **Database**: PostgreSQL database for storing data on energy components.

## Features

### Solar ROI Calculator

- **Purpose**: Calculates the ROI for solar energy investments based on user inputs.
- **Functionality**: Takes parameters such as installation cost, expected savings, and payback period, then returns a detailed ROI estimation.
- **Access**: Available to all users on the main webpage.

### Admin Dashboard

- **Authentication**: Only accessible by logged-in admins, providing secure data handling.
- **Component Management**:
  - **Generators**: Add, view, edit, and delete generator entries.
  - **Inverters**: Manage inverter data with full CRUD capabilities.
  - **Solar Charge Controllers**: Control and update solar charge controller entries.
- **Modals**: All operations (add, update) are handled through modal popups for a cleaner UI.
- **Logout**: Securely log out from the dashboard to prevent unauthorized access.

## Setup and Installation

### Prerequisites

Ensure the following are installed:

- **Node.js** and **npm**
- **PostgreSQL**
- **dotenv** (for environment variables)

### Environment Variables

Create a `.env` file in the project root with the following:

```plaintext
PORT=5000
JWT_SECRET=your_jwt_secret
DATABASE_URL=your_postgres_connection_string
```
