# # Specify the base Docker image. You can read more about
# # the available images at https://crawlee.dev/docs/guides/docker-images
# # You can also use any other image from Docker Hub.
# FROM apify/actor-node-puppeteer-chrome:20

# # Copy just package.json and package-lock.json
# # to speed up the build using Docker layer cache.
# COPY --chown=myuser package*.json ./

# # Install NPM packages, skip optional and development dependencies to
# # keep the image small. Avoid logging too much and print the dependency
# # tree for debugging
# RUN npm --quiet set progress=false \
#     && npm install --omit=dev --omit=optional \
#     && echo "Installed NPM packages:" \
#     && (npm list --omit=dev --all || true) \
#     && echo "Node.js version:" \
#     && node --version \
#     && echo "NPM version:" \
#     && npm --version

# # Next, copy the remaining files and directories with the source code.
# # Since we do this after NPM install, quick build will be really fast
# # for most source file changes.
# COPY --chown=myuser . ./


# # Run the image. If you know you won't need headful browsers,
# # you can remove the XVFB start script for a micro perf gain.
# CMD ./start_xvfb_and_run_cmd.sh && npm start --silent





# Use the official Node.js image as the base image
FROM node:20.1.0-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port your application will run on
EXPOSE 3000

# Define the command to run your application
CMD ["npm", "start"]
