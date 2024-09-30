

# eLitmus

The eLitmus Examination Portal is a robust web application designed to facilitate the eLitmus test preparation process. Built using React for the frontend and Django Rest Framework (DRF) for the backend, the platform provides a seamless experience for users looking to enhance their skills and perform well in the eLitmus examination.

## Features
- User Authentication and Authorization
- Profile Management
- Exam Management
- Examination Functionality
- Results Analysis

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Installation and Setup](#installation-and-setup)
3. [Backend Setup (Django)](#backend-setup-django)
4. [Frontend Setup (Next.js)](#frontend-setup-nextjs)
5. [Contributing](#contributing)

---

## Tech Stack

**Frontend:** 
- [React](https://react.dev/learn)

**Backend:** 
- [Django](https://www.djangoproject.com/)
- [Django REST Framework (API)](https://www.django-rest-framework.org/)
- [JWT (Authentication)](https://jwt.io/introduction)

**Database:** 
- SQLite

---

## Installation and Setup

### Prerequisites

Ensure that the following tools are installed on your machine:
- [Node.js](https://nodejs.org/en/) (for frontend)
- [Python](https://www.python.org/) (for backend)

### Backend Setup (Django)

1. **Clone the repository**:
   ```bash
   git clone https://github.com/MeetkumarChavda/eLitmus.git
   cd backend
   ```

2. **Set up a virtual environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Apply migrations**:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

5. **Create a superuser (admin)**:
   ```bash
   python manage.py createsuperuser
   ```

6. **Run the Django development server**:
   ```bash
   python manage.py runserver
   ```

   The backend API will be available at `http://127.0.0.1:8000/`.

### Frontend Setup (Next.js)

1. **Clone the frontend repository**:
   ```bash
   git clone https://github.com/MeetkumarChavda/eLitmus.git
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the React.js development server**:
   ```bash
   npm start
   ```

   The frontend will be available at `http://localhost:3000/`.

---

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -am 'Add some feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Create a Pull Request.

---
