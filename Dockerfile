# Stage 1: Build the application using Maven and JDK
FROM maven:3.9.6-eclipse-temurin-21-alpine AS builder

# Set working directory
WORKDIR /app

# Copy all project files to the container
COPY . .

# Build the project and skip tests
RUN mvn clean package -DskipTests

# Stage 2: Run the application using a lightweight JDK image
FROM eclipse-temurin:21-jdk-alpine

# Set working directory
WORKDIR /app

# Copy only the built JAR from the builder stage
COPY --from=builder /app/target/ecommerce-0.0.1-SNAPSHOT.jar app.jar

# Expose the port Spring Boot runs on
EXPOSE 8080

# Start the application
CMD ["java", "-jar", "app.jar"]
