FROM node:14
WORKDIR /app
COPY . /app
RUN npm install
EXPOSE 3001
# variables de entorno
ENV PORT 3001
ENV DB_URL postgres://root:root@database:5432/fiberhome?sslmode=disable
ENV JWT_KEY fPwFkU4%p!$QzSabBfAd@mn^  
#iniciar 
CMD ["npm", "run", "start"]
