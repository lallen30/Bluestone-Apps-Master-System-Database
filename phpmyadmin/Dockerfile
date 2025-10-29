FROM phpmyadmin:latest

# Set environment variables
ENV PMA_ARBITRARY=1
ENV PMA_HOST=db
ENV PMA_PORT=3306
ENV UPLOAD_LIMIT=300M

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

# Start Apache
CMD ["apache2-foreground"]
