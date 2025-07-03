#use on official nodejs image
FROM node:22

#set the working directory
WORKDIR /app

#copy package.json and package-lock.json
COPY package*.json ./

#install dependencies
RUN npm install

#copy the rest of the application code
COPY . .

# ✅ Generate Prisma Client inside the container
RUN npx prisma generate

#expose the application port
EXPOSE 3000

#start the application
CMD ["node", "./src/server.js"]