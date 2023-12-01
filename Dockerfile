# Build Stage
FROM maven:3.8.4-openjdk-17 AS build
WORKDIR /app
COPY . /app
RUN mvn -f /app/pom.xml clean package

# Production Stage
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
RUN addgroup -S myappgroup && adduser -S myappuser -G myappgroup
RUN chown myappuser:myappgroup /app/app.jar
USER myappuser
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/app.jar"]