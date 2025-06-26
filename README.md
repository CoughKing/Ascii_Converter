# 🖼️ Image to ASCII Art Converter

This is a fullstack web application that converts images into ASCII art. The frontend is built with **React + Vite + TypeScript**, and the backend uses **Django + Django REST Framework** with **OpenCV** for image processing.

---
## 🖼️ Example Output

### 🔹 Original Image
<img src="/nier2b.jpg" width="300"/>

### 🔸 ASCII Output (Width: 100)
<img src="/100width.jpg" width="500"/>

### 🔸 ASCII Output (Width: 400)
<img src="/400width.jpg" width="500"/>


## 🌐 Live Demo

> _(Optional: Add link here if deployed)_

---

## 🧱 Tech Stack

### Frontend
- React
- Vite
- TypeScript
- Axios

### Backend
- Django
- Django REST Framework
- OpenCV (cv2)
- NumPy
- Pillow

---

## 📦 Installation

### ⚙️ Backend (Django)

```bash
# Setup virtual environment
python -m venv env
source env/bin/activate  # or use `env\Scripts\activate` on Windows

# Install dependencies
pip install django djangorestframework django-cors-headers opencv-python numpy pillow

# Create Django project and app
django-admin startproject backend
cd backend
python manage.py startapp api

# Run migrations
python manage.py migrate

# Start the server
python manage.py runserver

# Create Vite + React + TS app
npm create vite@latest frontend -- --template react-ts
cd frontend

# Install dependencies
npm install axios

# Start the dev server
npm run dev

🚀 Usage

    Upload an image from the frontend.

    Choose output width for the ASCII art.

    The image is sent to the Django backend.

    Backend processes the image with OpenCV and returns ASCII characters.

    ASCII output is rendered in a styled <pre> block.

🧠 Core Features

    🎨 Upload images of any size and type (JPG, PNG, etc.)

    ✨ Real-time ASCII conversion

    📏 Adjustable width (for text art size)

    ⚙️ Fully decoupled frontend/backend

    🔒 Secure file handling using MultiPartParser

Project Structure

image-to-ascii/
├── backend/
│   ├── api/
│   │   ├── views.py
│   │   ├── utils.py  # ASCII conversion logic
│   │   └── urls.py
│   ├── backend/
│   │   ├── settings.py
│   └── manage.py
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── AsciiConverter.tsx
│   │   └── App.tsx
│   └── vite.config.ts
└── README.md


📝 License

This project is open source and available under the MIT License.