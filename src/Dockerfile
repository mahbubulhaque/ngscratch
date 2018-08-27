FROM node:8

RUN npm cache verify

RUN npm install --no-progress --loglevel=error npm@latest -g
RUN npm install --no-progress --loglevel=error webpack@latest -g
RUN npm install --no-progress --loglevel=error webpack-cli@latest -g
RUN npm install --no-progress --loglevel=error webpack-dev-server@latest -g

WORKDIR "/app"
COPY package.json /app
RUN rm -rf package-lock.json
RUN npm install
COPY . /app
RUN ls
EXPOSE 3073
CMD [ "npm", "run", "build_prod" ]
