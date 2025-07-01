# 1. Imagem base
FROM node:22-alpine

# 2. Diretório de trabalho
WORKDIR /app

# 3. Copia os arquivos de dependências
COPY package*.json ./

# 4. Instala dependências
RUN npm install --production

# 5. Copia o restante do código
COPY . .

# 6. Compila o projeto (ajuste se usar SWC ou tsc)
RUN npm run build

# 7. Expõe a porta padrão do NestJS
EXPOSE 3000

# 8. Comando para iniciar a aplicação
CMD ["npm", "run", "start:prod"]