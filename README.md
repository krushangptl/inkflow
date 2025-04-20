# inkFlow

inkFlow is a lightweight web project that combines a modern frontend with a Python FastAPI backend and an SQLite database for managing user accounts and blog posts. The platform is designed for tech enthusiasts and writers to share and discover insightful articles, with an easy-to-use editor and dynamic content display.

---

## Table of Contents

- [File Structure](#file-structure)
- [Tech Stack](#tech-stack)
- [Frontend Overview](#frontend-overview)
- [Backend Overview](#backend-overview)
- [How the Backend Connects to the Frontend](#how-the-backend-connects-to-the-frontend)
- [FastAPI Usage](#fastapi-usage)
- [SQLite Usage](#sqlite-usage)
- [Conclusion](#conclusion)

---

## File Structure

Below is an overview of the project’s file structure:

```
.
├── backend/                    # Backend server logic (FastAPI)
│   ├── main.py                # Entry point of the FastAPI app with all API routes
│   ├── models.py              # Pydantic models for input/output data validation
│   ├── __pycache__/          # Auto-generated Python bytecode for performance
│   │   ├── database.cpython-310.pyc
│   │   ├── main.cpython-310.pyc
│   │   └── models.cpython-310.pyc
│   ├── uploads/              # Directory to store uploaded files (e.g., profile pics)
│   └── users.db              # SQLite database storing users and blog data
│
└── frontend/                  # All static frontend files
    ├── assets/               # External libraries and frameworks
    │   ├── bootstrap.bundle.min.js  # Bootstrap JavaScript bundle (includes Popper)
    │   ├── bootstrap.min.css        # Bootstrap CSS
    │   ├── quill.min.js             # Quill rich-text editor JS
    │   └── quill.snow.css           # Quill theme stylesheet
    │
    ├── css/                  # Page-specific custom CSS styles
    │   ├── account.css       # Styling for user account page
    │   ├── article.css       # Styling for the articles list page
    │   ├── editor.css        # Styling for the blog editor page
    │   └── login.css         # Styling for the login page
    │
    ├── html/                 # All sub-pages of the application
    │   ├── account.html      # Account management page
    │   ├── article.html      # Page displaying a list/grid of blog articles
    │   ├── blog.html         # Single blog view page
    │   ├── editor.html       # Blog creation/editor page using Quill
    │   └── login.html        # Login screen for user authentication
    │
    ├── index.html            # Main homepage of the blog
    ├── script.js             # Shared JS (optional/general scripts for navbar, etc.)
    │
    ├── scripts/              # JavaScript files for specific pages
    │   ├── account.js        # Handles account page logic
    │   ├── article.js        # Fetches and displays list of blog articles
    │   ├── blog.js           # Loads a single blog post via URL query param
    │   ├── editor.js         # Manages blog creation with Quill and API POST
    │   └── login.js          # Manages login form, localStorage, and auth
    │
    └── style.css             # Optional global styling shared across pages
```

---

## Tech Stack

- **Frontend:**
  - **HTML5/CSS3** for markup and styling.
  - **JavaScript** for dynamic content and API calls.
  - **Bootstrap 5** for responsive design and layout.
  - **Quill.js** (optional) for rich text editing in the blog editor.
- **Backend:**
  - **Python** using the **FastAPI** framework for creating RESTful APIs.
  - **SQLite** as the file-based relational database to store user and blog data.
  - **Uvicorn** as the ASGI server to run the FastAPI application.
- **Other Tools:**
  - **Git** for version control.
  - **CORS Middleware** (provided by FastAPI) to enable cross-origin requests from the frontend.

---

## Frontend Overview

The frontend of inkFlow is built using plain HTML, CSS, and JavaScript—augmented with Bootstrap for a responsive UI. Key pages include:

- **index.html**  
  Displays a hero section with a call-to-action and loads the latest blog posts dynamically through `script.js`. The blog cards are rendered using data fetched from the backend API (`/blogs`).

- **article.html**  
  Lists all available articles. The page uses `article.js` to fetch blog posts from the `/blogs` endpoint and display them as cards. The container is uniquely identified (via `id="article-posts"`) so that JavaScript can inject the blog content dynamically.

- **blog.html**  
  Shows a full blog post when a user clicks on the "Read More" link. It extracts the blog ID from the URL query string and fetches a specific blog post from the backend API (`/blogs/{id}`).

- **editor.html**  
  Provides a form with a Quill.js editor for users to write and submit new blog posts. Submitted data is sent to the backend via a POST request to the `/blogs` endpoint.

The JavaScript files are responsible for rendering navigation links based on user authentication (using data from `localStorage`) and for fetching data from the API to display on each page.

---

## Backend Overview

The backend is built with FastAPI and is responsible for:

- **User Authentication:**  
  Routes for user registration (`/register`), login (`/login`), updating user data, and password changes.

- **Blog Management:**  
  Routes to create new blog posts (`/blogs` POST), retrieve all blog posts (`/blogs` GET), fetch the latest blogs (`/blogs/latest`), and get individual blog posts (`/blogs/{blog_id}`).

- **File Uploads:**  
  Handling of profile picture uploads via a specific endpoint.

The application initializes its SQLite database on start-up (creating tables for users and blogs if they do not exist) and uses SQL queries to perform CRUD operations.

---

## How the Backend Connects to the Frontend

The connection between the frontend and backend is handled using **AJAX/Fetch API** calls in the JavaScript code:

- **Frontend Fetch Requests:**  
  The JavaScript files (e.g., `script.js` and `article.js`) use the Fetch API to request data from endpoints such as `http://localhost:8000/blogs`.
- **CORS Middleware:**  
  The backend is configured with CORS middleware to allow requests from all origins (adjustable for production). This lets your frontend, which might be served from a different port or domain, communicate with your backend.
- **Data Flow:**
  1. When the user visits a page, the JavaScript code initiates a fetch request to a specific API endpoint.
  2. The FastAPI backend processes the request, interacts with the SQLite database, and returns JSON data.
  3. The JavaScript then parses the JSON and dynamically renders content (such as blog cards or full blog details) into the DOM.

---

## FastAPI Usage

- **Route Definitions:**  
  FastAPI is used to define endpoints with decorators like `@app.post` and `@app.get`. Each endpoint corresponds to a function that handles requests.
- **Data Validation:**  
  Incoming request data is validated using Pydantic models defined in `models.py` (e.g., `UserRegister`, `BlogCreate`). This ensures only valid data is processed.
- **Error Handling:**  
  FastAPI raises `HTTPException` for error scenarios (e.g., user not found, invalid credentials) that are sent as JSON error messages to the frontend.
- **Middleware:**  
  CORS middleware is added to the FastAPI instance so that it accepts requests from the frontend irrespective of the domain.

---

## SQLite Usage

- **Database Connection:**  
  A helper function `get_db()` is used to connect to the SQLite database (`users.db`). The connection uses `sqlite3.Row` to facilitate accessing rows as dictionaries.

- **Table Initialization:**  
  On startup, `main.py` checks for and creates the `users` and `blogs` tables if they don't exist. The blog table includes columns for `id`, `title`, `content`, and a timestamp (`created_at`).

- **CRUD Operations:**  
  Standard SQL queries are used to insert, fetch, update, and delete records. For example, when a new blog is posted, an `INSERT` statement adds the blog data to the `blogs` table.

---

## Conclusion

inkFlow is a modern web project that seamlessly integrates a rich frontend with a robust Python FastAPI backend and an SQLite database. The use of modern web technologies such as Bootstrap and dynamic JavaScript allows for responsive and user-friendly interfaces, while FastAPI provides a high-performance API layer with excellent data validation and error handling. SQLite offers a lightweight and easy-to-maintain solution for data persistence.

By following the principles outlined in this README, developers can easily understand the project structure, how data flows between the frontend and backend, and how key technologies (FastAPI and SQLite) are utilized to build a scalable and maintainable web application. Whether you’re looking to expand the platform or use it as a learning tool, inkFlow serves as an excellent foundation for building modern web projects.

---
