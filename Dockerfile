FROM nginx:1.22
COPY dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/vhosts.d/checkout.conf
