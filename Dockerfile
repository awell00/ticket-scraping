FROM node:19

WORKDIR /app

COPY package.json ./
COPY . .

RUN npm install

# Install dependencies
RUN apt-get update && \
    apt-get install -yq wget gnupg2 ca-certificates && \
    wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - && \
    sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' && \
    apt-get update && \
    apt-get install -yq google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxtst6 libxss1 --no-install-recommends && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Install NPM
RUN npm install -g pm2

# Set environment variables
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# Copy the app files
COPY ./dist .

# Start the app
CMD ["pm2-runtime", "app.js"]
