# golem runs this as an arbitrary non-root uid, with a read-only root
# filesystem, a writable /tmp and (if declared) /data. Nothing here may need
# root at start-up.
FROM node:22-alpine
WORKDIR /app
ARG VERSION=dev
ENV VERSION=$VERSION PORT=8080
COPY server.js ./
USER 10001:10001
EXPOSE 8080
CMD ["node", "server.js"]
