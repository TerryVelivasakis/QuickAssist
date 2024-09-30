# Use an official Python runtime as a parent image
FROM python:3.12-slim

# Set environment variable to prevent Python from writing pyc files to disk
ENV PYTHONDONTWRITEBYTECODE 1

# Set environment variable to buffer output (useful for logging in Docker)
ENV PYTHONUNBUFFERED 1

# Set the working directory in the container
WORKDIR /app

# Copy the requirements.txt file into the container
COPY requirements.txt .

# Install dependencies
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy the current directory contents into the container at /app
COPY . /app

# Expose port 5000 to allow external access
EXPOSE 5000

# Set the environment variable for Flask
ENV FLASK_APP=run.py

# Run the Flask app with SocketIO
CMD ["python", "run.py"]
