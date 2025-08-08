# 🚀 How to Start the Application (For Non-Developers)

## Prerequisites (One-time setup)

### 1. Install Docker Desktop

1. Go to [https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)
2. Click "Download for Windows"
3. Run the installer and follow the instructions
4. Restart your computer when prompted
5. Start Docker Desktop (it should start automatically on boot)

### 2. Download the Project

1. Download the project from GitHub as a ZIP file
2. Extract the ZIP file to a folder on your computer (e.g., Desktop)

## Creating a Desktop Shortcut (Recommended)

### One-time Setup

1. **Double-click** the file called `create-desktop-shortcut.bat`
2. This will create a desktop icon called "Client Billing App"
3. You can now start the app from your desktop anytime!

## Starting the Application

### Option 1: Using Desktop Shortcut (Super Easy - Recommended)

1. **Double-click** the "Client Billing App" icon on your desktop
2. Wait for the application to start (this may take 2-3 minutes the first time)
3. Your web browser will open automatically to the application
4. You're ready to use the application! 🎉

### Option 2: Using Project Files

1. **Double-click** the file called `docker-start.bat`
2. Wait for the application to start (this may take 2-3 minutes the first time)
3. Open your web browser and go to: **http://localhost:3000**

### Option 3: Manual Steps (Advanced)

1. Open Command Prompt (search for "cmd" in Windows search)
2. Navigate to the project folder:
   ```
   cd C:\path\to\your\project\folder
   ```
3. Type this command and press Enter:
   ```
   docker-compose up --build -d
   ```
4. Wait for it to finish
5. Open your web browser and go to: **http://localhost:3000**

## Stopping the Application

### Option 1: Super Easy

- **Double-click** the file called `docker-stop.bat`

### Option 2: Manual

- In Command Prompt, type: `docker-compose down`

## Troubleshooting

### If the application doesn't start:

1. **Make sure Docker Desktop is running**

   - Look for the Docker whale icon in your system tray
   - If it's not there, start Docker Desktop

2. **Check if ports are available**

   - Close any other applications that might be using ports 3000, 5000, or 3306
   - Common culprits: Skype, other web servers, MySQL

3. **Restart Docker Desktop**

   - Right-click the Docker icon in system tray
   - Select "Restart"

4. **Check the logs**
   - In Command Prompt, type: `docker-compose logs`
   - Look for any error messages

### If you see "port already in use" error:

1. Close other applications
2. Or restart your computer
3. Try starting the application again

### If the website doesn't load:

1. Make sure you're using the correct URL: **http://localhost:3000**
2. Wait a few more minutes (first startup can be slow)
3. Check if Docker containers are running:
   - Open Command Prompt
   - Type: `docker ps`
   - You should see 3 containers running

## What Each Service Does

- **Frontend (Port 3000)**: The website you interact with
- **Backend (Port 5000)**: Handles data and business logic
- **Database (Port 3306)**: Stores all your data

## Important Notes

- **First startup is slow**: The first time you run the application, it needs to download and build everything. This can take 5-10 minutes.
- **Keep Docker Desktop running**: The application needs Docker to run
- **Data is saved**: Your data will be saved between sessions
- **Don't delete the project folder**: This contains all your data

## Need Help?

If you're still having issues:

1. Make sure Docker Desktop is installed and running
2. Try restarting your computer
3. Check that you're using the correct URL: **http://localhost:3000**
4. Contact your developer friend for help! 😊
