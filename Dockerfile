###################
# BUILD FOR PRODUCTION
###################

# Base image
FROM node:20.12.1 As build

WORKDIR /usr/src

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY --chown=node:node package*.json ./

# Install app dependencies
RUN npm ci

# Bundle app source
COPY --chown=node:node . .

# Run the build command which creates the production bundle
RUN npm run build

# Set NODE_ENV environment variable
ENV NODE_ENV prod

# Running `npm ci` removes the existing node_modules directory and passing in --only=production ensures that only the production dependencies are installed. This ensures that the node_modules directory is as optimized as possible
RUN npm ci --only=production && npm cache clean --force

USER node

###################
# PRODUCTION
###################

FROM node:20.12.1 As production

# Copy the bundled code from the build stage to the production image
COPY --chown=node:node --from=build /usr/src/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/dist ./dist
COPY --chown=node:node --from=build /usr/src/dist/config/environment ./config/environment

# Set NODE_ENV environment variable
ENV NODE_ENV prod

# Start the server using the production build
CMD [ "node", "dist/src/main.js" ]

USER node
