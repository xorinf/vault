# Vault Backend

College resource-sharing platform backend. Built with Node.js, Express, and MongoDB.

## Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express
- **Database**: MongoDB (Mongoose ODM)
- **Auth**: JWT (single token, httpOnly cookie)
- **File Storage**: Cloudinary (via multer memoryStorage + upload stream)

## Quick Start

```bash
# Clone the repo
git clone https://github.com/xorinf/vault-backend.git
cd vault-backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your values

# Start MongoDB (if local)
mongod --dbpath ./.mongodata

# Start development server
npm run dev
```

The server runs on `http://localhost:5000` by default.

## API Endpoints

### Auth (`/auth`)
| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | `/register` | Register | No |
| POST | `/login` | Login | No |
| PUT | `/password` | Change password | Yes |
| GET | `/check-auth` | Verify session | Yes |
| GET | `/logout` | Logout | No |

### Student (`/student-api`)
| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | `/resources` | List active resources | Yes |
| GET | `/resource/:id` | Get single resource | Yes |
| PUT | `/comment` | Add comment | Yes |
| POST | `/vote` | Cast vote | Yes |
| DELETE | `/vote/:resourceId` | Remove vote | Yes |
| GET | `/search?q=term` | Search resources | Yes |

### Resource + Admin (`/resource-api`)
| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | `/resource` | Upload resource | Yes |
| GET | `/resources` | Own resources | Yes |
| GET | `/resource/:id` | Single resource | Yes |
| PUT | `/resource` | Edit resource | Yes |
| PATCH | `/resource/delete/:id` | Soft delete | Yes |
| PATCH | `/resource/restore/:id` | Restore | Yes |
| GET | `/all-resources` | All (admin) | Admin |
| GET | `/users` | All users (admin) | Admin |
| PATCH | `/users/status/:id` | Toggle user | Admin |
| PATCH | `/resources/status/:id` | Toggle resource | Admin |

## Project Structure

```
APIs/          - Route handlers (AuthAPI, StudentAPI, ResourceAPI)
config/        - Cloudinary, multer configs
middlewares/   - JWT verification
models/        - Mongoose schemas (User, Resource, Vote)
ping/          - .http files for API testing
server.js      - Entry point
```

## Testing

Use the `.http` files in the `ping/` folder with the REST Client VS Code extension.

## License

ISC
