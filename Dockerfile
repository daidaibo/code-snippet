# 使用官方的 Ubuntu 作为基础镜像
FROM ubuntu:20.04

# 更新包列表并安装 OpenJDK 11
RUN apt-get update && \
    apt-get install -y openjdk-11-jdk && \
    apt-get clean;

# 设置 JAVA_HOME 环境变量
ENV JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64

# 验证安装
RUN java -version

# 设置工作目录
WORKDIR /app

# 复制你的应用程序到容器中
COPY backend-0.0.1-SNAPSHOT.jar /app/backend-0.0.1-SNAPSHOT.jar

# 设置默认的命令行来运行你的 Java 应用程序
CMD ["java", "-jar", "/app/backend-0.0.1-SNAPSHOT.jar"]

# docker-compose up -d