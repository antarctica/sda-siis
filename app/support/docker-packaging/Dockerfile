FROM nginx:alpine

LABEL maintainer = "Felix Fennell <felnne@bas.ac.uk>"

ENV SERVICE_API_ENDPOINT="10.70.1.145:32002"
ENV SERVICE_API_KV_ENDPOINT="10.70.1.145:32003"
ENV SERVICE_API_OGC_ENDPOINT="10.70.1.145:32001/geoserver/ows"

COPY ./dist/ /usr/share/nginx/html/
