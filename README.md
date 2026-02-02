# Mobile Attendance Tracker

## Overview
Mobile Attendance Tracker is an application designed to simplify attendance management, enabling teachers and organization managers to monitor attendance seamlessly. With its user-friendly interface and integration of modern features, it caters to both in-person and virtual settings.

## Features
- **User Authentication**: Secure login system for both administrators and attendees.
- **Attendance Insights**: Generate daily, weekly, or custom reports.
- **QR Scanning**: Scan QR codes to register attendance quickly.
- **Notifications**: Reminders for attendees who miss submissions.
- **Export Data**: Export attendance reports in formats like CSV or PDF.

## Installation
To run this project locally, follow the steps below:
1. Clone this repository:
   ```bash
   git clone https://github.com/Sasudul/Mobile-Attendance-Tracker.git
   ```
2. Navigate to the project directory:
   ```bash
   cd Mobile-Attendance-Tracker
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Configure environment variables by creating a `.env` file.
5. Run the app:
   ```bash
   npm start
   ```

## Technologies Used
- **Frontend**: React Native, Expo
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: Firebase Authentication

## How It Works
1. **Setup**:
   - Administrator sets up the attendee list and generates session QR codes.
2. **Attendance Registration**:
   - Attendees scan the QR code through the app or enter the session details manually.
3. **Data Management**:
   - The system updates reports automatically in real-time.

## Contributors
- [Sasudul](https://github.com/Sasudul)
- Contributions are welcome via pull requests!

## License
This project is licensed under the [MIT License](LICENSE).

## Feedback
If you find any issues or want to suggest improvements, feel free to create an issue in the repository.