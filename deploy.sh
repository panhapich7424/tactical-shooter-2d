#!/bin/bash

# Tactical Shooter 2D - Deployment Script
# This script builds and deploys the game to Firebase

echo "🎮 Tactical Shooter 2D - Deployment Script"
echo "=========================================="

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null
then
    echo "❌ Firebase CLI not found. Installing..."
    npm install -g firebase-tools
fi

# Check if logged in to Firebase
echo "🔐 Checking Firebase authentication..."
firebase projects:list &> /dev/null
if [ $? -ne 0 ]; then
    echo "❌ Not logged in to Firebase. Please login:"
    firebase login --no-localhost
fi

# Build client
echo "🔨 Building client..."
cd client
if [ ! -d "node_modules" ]; then
    echo "📦 Installing client dependencies..."
    npm install
fi
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Client build failed!"
    exit 1
fi
cd ..

# Install functions dependencies
echo "📦 Installing functions dependencies..."
cd functions
if [ ! -d "node_modules" ]; then
    npm install
fi
cd ..

# Deploy to Firebase
echo "🚀 Deploying to Firebase..."
firebase deploy

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo "🎮 Your game is live!"
    firebase hosting:channel:list
else
    echo "❌ Deployment failed!"
    exit 1
fi
