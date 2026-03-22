FROM node:22

WORKDIR /app

# Install serve globally
RUN npm install -g serve

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy full project
COPY . .

# Build frontend
RUN npm run build

# Expose ports
EXPOSE 3000
EXPOSE 4000

# Run backend + frontend
CMD sh -c "node server/index.js & serve -s dist -l 3000"
