#!/bin/bash

# Navigate to theme package
cd packages/theme

# Ensure clean build
echo "Building theme package..."
pnpm build

# Publish
echo "Publishing to npm..."
# Note: This requires you to be logged in to npm (npm login)
npm publish --access public

echo "Done!"
