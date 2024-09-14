#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# Function to generate a random password
generate_password() {
    openssl rand -base64 12
}

# Function to generate a random secret
generate_secret() {
    openssl rand -hex 32
}

# Function to create .env file
create_env_file() {
    local db_name=$1
    local db_user=$2
    local db_password=$3
    local admin_username=$4
    local admin_password=$5
    local nextauth_secret=$6
    local nextauth_url=$7

    cat > .env << EOF
DATABASE_URL="postgresql://${db_user}:${db_password}@localhost:5432/${db_name}"
ADMIN_USERNAME="${admin_username}"
ADMIN_PASSWORD="${admin_password}"
NEXTAUTH_SECRET="${nextauth_secret}"
NEXTAUTH_URL="${nextauth_url}"
EOF

    echo "Created .env file with all required credentials and settings."
}

# Function to drop and recreate database and user
setup_database() {
    local db_name=$1
    local db_user=$2
    local db_password=$3
    
    sudo -u postgres psql <<EOF
DROP DATABASE IF EXISTS ${db_name};
DROP USER IF EXISTS ${db_user};
CREATE USER ${db_user} WITH ENCRYPTED PASSWORD '${db_password}' CREATEDB;
CREATE DATABASE ${db_name};
GRANT ALL PRIVILEGES ON DATABASE ${db_name} TO ${db_user};
EOF

    echo "Database and user setup completed."
}

# Main script execution

echo "Checking PostgreSQL installation..."
if ! command -v psql &> /dev/null; then
    echo "PostgreSQL not found. Installing..."
    sudo apt-get update
    sudo apt-get install -y postgresql postgresql-contrib
    echo "PostgreSQL installed successfully."
fi

echo "Ensuring PostgreSQL is running..."
sudo systemctl start postgresql
sudo systemctl enable postgresql

echo "Generating new database credentials..."
db_name="nextjs_store"
db_user="nextjs_user"
db_password=$(generate_password)

echo "Setting up database and user..."
setup_database $db_name $db_user $db_password

echo "Generating additional credentials and settings..."
admin_username="Tidan"
admin_password="Poopyistheking@1"
nextauth_secret=$(generate_secret)
nextauth_url="http://localhost:3000"

echo "Creating .env file..."
create_env_file $db_name $db_user $db_password $admin_username $admin_password $nextauth_secret $nextauth_url

echo "Verifying database connection..."
if PGPASSWORD=$db_password psql -h localhost -U $db_user -d $db_name -c '\q' 2>/dev/null; then
    echo "Database connection successful."
else
    echo "Failed to connect to the database. Please check your PostgreSQL configuration."
    exit 1
fi

echo "Database and environment setup completed successfully!"