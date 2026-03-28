#!/usr/bin/env bash
# exit on error
set -o errexit

echo "Building React Frontend..."
cd client
npm install
npm run build
cd ..

echo "Building Django Backend..."
cd server
pip install -r requirements.txt
python manage.py collectstatic --noinput
python manage.py migrate
