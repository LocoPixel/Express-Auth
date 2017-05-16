FROM alpine

# Update apk and install node
RUN apk update && apk upgrade
RUN apk add nodejs

# Create app directory
RUN mkdir -p /app
ADD app/package.json /app
WORKDIR /app/

ENV HOME /app
ENV NODE_ENV development

# Install dependencies
RUN npm install

# Development Only
#VOLUME ["/mnt_vol"]

# Production
ADD app /app

EXPOSE 3002
CMD npm start


