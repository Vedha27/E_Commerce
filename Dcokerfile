# Use a lightweight OpenJDK base image
FROM eclipse-temurin:21-jdk-alpine

# Set application JAR file name
ARG JAR_FILE=target/ecommerce-0.0.1-SNAPSHOT.jar

# Set working directory inside container
WORKDIR /app

# Copy built JAR from local to container
COPY ${JAR_FILE} app.jar

# Expose port 8080
EXPOSE 8080

# Run the JAR
ENTRYPOINT ["java", "-jar", "app.jar"]
