# Stage 1: Install PHP dependencies
FROM php:8.3-fpm-alpine AS composer-builder

RUN apk add --no-cache \
    sqlite \
    sqlite-dev \
    libpng-dev \
    libzip-dev \
    zip \
    unzip \
    curl

RUN docker-php-ext-install pdo pdo_sqlite pdo_mysql bcmath gd zip

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-scripts

COPY . .

# Stage 2: Build frontend assets (needs PHP/artisan for wayfinder)
FROM php:8.3-fpm-alpine AS node-builder

RUN apk add --no-cache \
    nodejs \
    npm \
    sqlite \
    sqlite-dev \
    libpng-dev \
    libzip-dev \
    zip \
    unzip \
    curl

RUN docker-php-ext-install pdo pdo_sqlite pdo_mysql bcmath gd zip

WORKDIR /app

COPY --from=composer-builder /app .
RUN npm ci

RUN npm run build

# Stage 3: PHP application (Final Production Layer)
FROM php:8.3-fpm-alpine

# Install system dependencies
RUN apk add --no-cache \
    nginx \
    supervisor \
    sqlite \
    sqlite-dev \
    libpng-dev \
    libzip-dev \
    zip \
    unzip \
    curl

# Install PHP extensions
RUN docker-php-ext-install pdo pdo_sqlite pdo_mysql bcmath gd zip

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copy the application (source + vendor) from composer-builder
COPY --from=composer-builder /app .

# Copy built frontend assets
COPY --from=node-builder /app/public/build ./public/build

# ✨ FIX 1: Pre-create missing logs and frameworks structures so root-owned folder setups don't lock out PHP
RUN mkdir -p storage/logs storage/framework/cache storage/framework/sessions storage/framework/views bootstrap/cache \
    && touch storage/logs/laravel.log

# ✨ FIX 2: REVERSE THE ORDER. Change directory ownership to the runtime user BEFORE executing any Laravel Artisan optimization command lines
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 775 /var/www/html/storage \
    && chmod -R 775 /var/www/html/bootstrap/cache

# ✨ FIX 3: Run the package discovery hook explicitly under the www-data execution profile scope context
USER www-data
RUN php artisan package:discover --ansi

# Switch back to root so supervisor system daemons can map active ports natively (Port 80)
USER root

# Copy nginx configuration
COPY docker/nginx.conf /etc/nginx/nginx.conf

# Copy supervisor configuration
COPY docker/supervisord.conf /etc/supervisord.conf

EXPOSE 80

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
