# **Umbra Task Management System - API Documentation**

**Version:** 1.0.0
**Base Path:** `/api`

---

## **Authentication & Authorization**

Authentication is handled via JSON Web Tokens (JWT). A JWT must be sent in the `Authorization` header for all protected routes.

- **Format:** `Authorization: Bearer <your_jwt_token>`
- **User Roles:**
  - `User`: Standard user with access to their own tasks and profile.
  - `Admin`: Has full access to all users and tasks in the system.

---

## **User Endpoints**

**Base Path:** `/api/user`

### `POST /register`
- **Description:** Registers a new user and sends a verification email.
- **Auth:** None
- **Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "password": "securePassword123",
    "title": "Software Engineer"
  }
  ```
- **Success Response (201' Created):**
  ```json
  {
    "success": true,
    "message": "User registered successfully, please check your email to complete your registration."
  }
  ```

### `POST /login`
- **Description:** Logs in a user and returns a JWT token.
- **Auth:** None
- **Body:**
  ```json
  {
    "email": "john.doe@example.com",
    "password": "securePassword123"
  }
  ```
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Login successful.",
    "token": "<jwt_access_token>",
    "user": {
      "_id": "<user_id>",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "isAdmin": false
    }
  }
  ```

### `GET /verify-email/:token`
- **Description:** Verifies the user's email address using the token sent to them.
- **Auth:** None
- **URL Params:**
  - `token` (string, required): The verification token from the email link.
- **Success Response (200 OK):**
  - Redirects to the login page on the client with a success message.

### `POST /logout`
- **Description:** Logs out the user. The primary action is on the client-side (clearing the token), but this endpoint can be used for server-side logging if needed.
- **Auth:** `User`
- **Success Response (200 OK):**
  ```json
  {
    "message": "Logged out successfully"
  }
  ```

### `POST /verify-code`
- **Description:** Verifies a six-digit code sent to the user's email (e.g., for password reset or two-factor auth).
- **Auth:** None
- **Body:**
  ```json
  {
    "email": "john.doe@example.com",
    "code": "123456"
  }
  ```
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Code verified successfully."
  }
  ```

### `GET /get-team`
- **Description:** Gets a list of all team members.
- **Auth:** `Admin`
- **Query Params:**
  - `search` (string, optional): Filter users by name or email.
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "users": [
      {
        "_id": "<user_id>",
        "name": "Jane Smith",
        "title": "Project Manager",
        "email": "jane.smith@example.com",
        "isActive": true
      }
    ]
  }
  ```

### `GET /notifications`
- **Description:** Retrieves all unread notifications for the logged-in user.
- **Auth:** `User`
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "notifications": [
      {
        "text": "New task 'Deploy to Production' has been assigned to you.",
        "task": "<task_id>",
        "createdAt": "..."
      }
    ]
  }
  ```

### `PUT /profile`
- **Description:** Updates the profile information for the logged-in user.
- **Auth:** `User`
- **Body:**
  ```json
  {
    "name": "Johnathan Doe",
    "title": "Senior Software Engineer",
    "avatarUrl": "https://example.com/new_avatar.png"
  }
  ```
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "User profile updated successfully."
  }
  ```

### `PUT /read-noti`
- **Description:** Marks all unread notifications as read for the logged-in user.
- **Auth:** `User`
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Notifications marked as read."
  }
  ```

### `PUT /change-password`
- **Description:** Changes the password for the logged-in user.
- **Auth:** `User`
- **Body:**
  ```json
  {
    "oldPassword": "securePassword123",
    "newPassword": "evenMoreSecurePassword456"
  }
  ```
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Password changed successfully."
  }
  ```

### `PUT /:id`
- **Description:** Activates or deactivates a user's profile.
- **Auth:** `Admin`
- **URL Params:**
  - `id` (string, required): The ID of the user to update.
- **Body:**
  ```json
  {
    "isActive": false
  }
  ```
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "User status updated successfully."
  }
  ```

### `DELETE /:id`
- **Description:** Deletes a user profile from the system.
- **Auth:** `Admin`
- **URL Params:**
  - `id` (string, required): The ID of the user to delete.
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "User deleted successfully."
  }
  ```

---

## **Task Endpoints**

**Base Path:** `/api/task`

### `POST /create`
- **Description:** Creates a new task.
- **Auth:** `Admin`
- **Body:**
  ```json
  {
    "title": "Design New Homepage",
    "team": ["<user_id_1>", "<user_id_2>"],
    "stage": "todo",
    "date": "2024-12-31T00:00:00.000Z",
    "priority": "HIGH",
    "assets": ["http://example.com/asset1.jpg"]
  }
  ```
- **Success Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "Task created successfully.",
    "task": { "_id": "<new_task_id>", ... }
  }
  ```

### `GET /`
- **Description:** Lists all tasks. Can be filtered by query parameters. Admins see all tasks; users see tasks assigned to them.
- **Auth:** `User`
- **Query Params:**
  - `stage` (string, optional): "todo", "in progress", or "completed".
  - `priority` (string, optional): "HIGH", "MEDIUM", "NORMAL", "LOW".
  - `search` (string, optional): Search term for task titles.
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "tasks": [
      {
        "_id": "<task_id>",
        "title": "Design New Homepage",
        "stage": "todo",
        "priority": "HIGH",
        ...
      }
    ]
  }
  ```

### `GET /:id`
- **Description:** Retrieves the details of a single task.
- **Auth:** `User`
- **URL Params:**
  - `id` (string, required): The ID of the task.
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "task": {
      "_id": "<task_id>",
      "title": "Design New Homepage",
      ...
    }
  }
  ```

### `PUT /update/:id`
- **Description:** Updates the details of an existing task.
- **Auth:** `Admin`
- **URL Params:**
  - `id` (string, required): The ID of the task to update.
- **Body:**
  ```json
  {
    "title": "Updated Task Title",
    "priority": "MEDIUM"
  }
  ```
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Task updated successfully."
  }
  ```

### `PUT /:id`
- **Description:** Moves a task to the trash (soft delete).
- **Auth:** `Admin`
- **URL Params:**
  - `id` (string, required): The ID of the task to trash.
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Task trashed successfully."
  }
  ```

### `DELETE /delete-restore/:id`
- **Description:** Permanently deletes a task or restores a trashed task.
- **Auth:** `Admin`
- **URL Params:**
  - `id` (string, required): The ID of the task.
- **Query Params:**
  - `action` (string, optional): Set to "restore" to restore a trashed task. If not provided, the task is permanently deleted.
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Task deleted/restored successfully."
  }
  ``` 