# Anambra TeleHealth Connect System

## Overview
The Anambra TeleHealth Connect system is a telemedicine platform designed to enhance healthcare delivery in Anambra State, Nigeria. The system includes a Django-based backend server and three frontend applications: doctor-app, personnel-app, and personnel-mobile, all managed with NX.

## Project Structure

### Backend
- **Technology**: Django
- **Description**: The backend server handles API requests, manages data, and provides business logic for the telemedicine platform.

### Frontend
Managed with NX, the frontend consists of the following applications:
- **doctor-app (Web - React)**: A web application for doctors to manage calls and patient information.
- **personnel-app (Web - React)**: A web application for health care assistants at primary health care centers to manage patient interactions and facilitate calls.
- **personnel-mobile (React Native)**: A mobile application for health care assistants, primarily rendering the personnel-app through a WebView component.

## Getting Started

### Prerequisites
- Node.js and npm
- Python and Django
- Git

### Installation
1. Clone the repository:
```
git clone https://github.com/oluwatobimaxwell/telehealthconnect.git
```


2. Install dependencies:
- Backend:
  ```
  cd backend
  pip install -r requirements.txt
  ```
- Frontend:
  ```
  cd frontend
  npm install
  ```

### Running the Applications
- Backend:
```
cd backend
python manage.py runserver
```

- Frontend:
- Doctor App:
  ```
  nx serve doctor-app
  ```
- Personnel App:
  ```
  nx serve personnel-app
  ```
- Personnel Mobile:
  ```
  nx serve personnel-mobile
  ```

## Contributing
Contributions to the Anambra TeleHealth Connect system are welcome. Please read our contributing guidelines for more information.

## License
This project is licensed under the [LICENSE NAME].

## Contact
For any inquiries or contributions, please contact [CONTACT INFORMATION].

## Acknowledgments
Special thanks to all contributors and stakeholders involved in this project.
