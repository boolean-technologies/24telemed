ARG VARIANT=ubuntu-22.04
FROM mcr.microsoft.com/vscode/devcontainers/base:${VARIANT}
ENV PYTHONUNBUFFERED=1

# Install weasyprint dependencies, needed for md2pdf
# libpq-dev is needed for psycopg2
# Node.js installation
RUN apt-get update && \
    apt-get install -y \
      python3-dev \
      python3-pip \
      python3-cffi \
      python3-distutils \
      libcairo2 \
      libpango1.0-0 \
      libgdk-pixbuf2.0-0 \
      libffi-dev \
      shared-mime-info \
      graphviz \
      libpq-dev \
      curl \
      gnupg && \
    curl -sL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    apt-get -y clean

ENV PYTHONPATH="/workspace/backend"
ENV NPM_TOKEN="replaceme"
ENV ENV="dev"
