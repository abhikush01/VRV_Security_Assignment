# VRV Security’s Backend Developer Intern Assignment  
## Role-Based Access Control (RBAC)  

### Overview  
This is a web application developed using the Spring Boot framework to demonstrate Role-Based Access Control (RBAC). It is designed to manage file permissions for three types of users: Viewer, Creator, and Admin. Each role has distinct access permissions, ensuring a secure and structured approach to resource management.  

### Features  

#### 1. **Authentication**  
- User authentication is implemented using JWT (JSON Web Tokens) for secure access control.  
- Passwords are securely hashed using bcrypt for enhanced security.  

#### 2. **Authorization**  
- The application enforces role-based permissions for performing operations:  
  - **Viewer**: Can only view files.  
  - **Creator**: Can upload, update, delete files, and view all their files. Uploaded files are stored in Cloudinary, and their links are saved in the PostgreSQL database.  
  - **Admin**:  
    - Promote Viewers to Creators.  
    - Delete users from the system.  

### Technologies Used  

#### Backend:  
- **Framework**: Spring Boot  
- **Database**: PostgreSQL  
- **Authentication**: JWT (JSON Web Tokens)  
- **Password Hashing**: bcrypt  

#### Frontend:  
- **Framework**: React.js  

### API Endpoints  

- **Authentication**:  
  - `POST /auth/login`: Login a user and generate a JWT.  
  - `POST /auth/signup`: Register a new user with default Viewer role.  

- **File Management**:  
  - `GET /api/files`: View all files (Viewer access).  
  - `POST /api/files`: Upload a new file (Creator access).  
  - `PUT /api/files/{id}`: Update a file's details (Creator access).  
  - `DELETE /api/files/{id}`: Delete a file (Creator access).  

- **Admin Actions**:  
  - `PUT /api/admin/{id}/promote`: Promote a Viewer to a Creator.  
  - `DELETE /api/admin/{id}`: Remove a user.  


