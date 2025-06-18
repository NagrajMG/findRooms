# findRooms.com - Room Listing Web App

findRooms is a full-stack web application built with Node.js, Express, MongoDB, and Bootstrap. It allows users to create, view, update, and delete rental room listings. Authentication is handled with Passport.js, and images are stored securely using Cloudinary.

## Features

- User Signup/Login using Passport.js (`passport-local`)
- CRUD for Listings (title, description, price, image, location, country)
- Add & delete reviews (1 to 5 stars, comments)
- Cloudinary integration for image uploads
- Flash messages for success/error feedback
- Server-side and client-side form validation

## 🧱 Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB + Mongoose
- **Auth**: Passport.js (passport-local-mongoose)
- **Storage**: Cloudinary (via multer-storage-cloudinary)
- **Templating**: EJS
- **CSS**: Bootstrap 5, FontAwesome
- **Others**: connect-flash, dotenv, method-override

## 📂 Project Structure
```bash
findRooms/
│
├── models/                  # Mongoose schemas: User, Listing, Review
├── routes/                  # Auth, Listings, Reviews routes
├── controllers/             # Business logic for each route
├── public/                  # Static assets: CSS, JS
├── views/                   # EJS templates
├── middleware.js            # Custom middleware (auth, validation)
├── cloudConfig.js           # Cloudinary integration
├── utils/                   # WrapAsync, ExpressError
├── app.js                   # Main server file
└── init/                    # Initial database setup
```

## 🌐 Setup Instructions

1. **Clone the repository**
```bash
git clone https://github.com/NagrajMG/findRooms.git
cd findRooms
```
2. **install dependencies**
```bash
npm install
```
3. **Environment variables**
```bash
CLOUD_NAME=your_cloudinary_name
CLOUD_API_KEY=your_key
CLOUD_API_SECRET=your_secret
MONGODB_KEY=your_mongo_uri
NODE_ENV=development
PORT=8080
```
4.**Initial listings**
```bash
node init/index.js
```
5.**Start the app**
```bash
node app.js
```



