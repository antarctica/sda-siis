# Based on: https://github.com/oscarfonts/docker-geoserver/blob/master/2.18.0/Dockerfile

FROM tomcat:9-jdk11

LABEL maintainer="Andreas Cziferszky <ancz@bas.ac.uk>"

ENV GEOSERVER_VERSION 2.18.0
ENV GEOSERVER_DATA_DIR /var/local/geoserver
ENV GEOSERVER_INSTALL_DIR /usr/local/geoserver
ENV GEOSERVER_EXT_DIR /var/local/geoserver-exts
ENV GEOSERVER_NODE_OPTS 'id:SIIS (Docker);background:purple;color:white'
ENV RAW_DATA_DIR /data

# Add GDAL
RUN apt-get update &&\
    apt-get install -y \
      binutils \
      libproj-dev \
      gdal-bin \
      libgdal-java
ENV GDAL_DATA /usr/share/gdal


# GeoServer
ADD conf/geoserver.xml /usr/local/tomcat/conf/Catalina/localhost/geoserver.xml
RUN mkdir ${GEOSERVER_DATA_DIR} \
    && mkdir ${GEOSERVER_INSTALL_DIR} \
    && mkdir ${GEOSERVER_EXT_DIR} \
    && mkdir ${RAW_DATA_DIR} \    
	&& cd ${GEOSERVER_INSTALL_DIR} \
	&& wget http://sourceforge.net/projects/geoserver/files/GeoServer/${GEOSERVER_VERSION}/geoserver-${GEOSERVER_VERSION}-war.zip \
	&& unzip geoserver-${GEOSERVER_VERSION}-war.zip \
	&& unzip geoserver.war \
    && mv data/* ${GEOSERVER_DATA_DIR} \
	&& rm -rf geoserver-${GEOSERVER_VERSION}-war.zip geoserver.war target *.txt


# Enable CORS
RUN sed -i '\:</web-app>:i\
<filter>\n\
    <filter-name>CorsFilter</filter-name>\n\
    <filter-class>org.apache.catalina.filters.CorsFilter</filter-class>\n\
    <init-param>\n\
        <param-name>cors.allowed.origins</param-name>\n\
        <param-value>*</param-value>\n\
    </init-param>\n\
    <init-param>\n\
        <param-name>cors.allowed.methods</param-name>\n\
        <param-value>GET,POST,HEAD,OPTIONS,PUT</param-value>\n\
    </init-param>\n\
</filter>\n\
<filter-mapping>\n\
    <filter-name>CorsFilter</filter-name>\n\
    <url-pattern>/*</url-pattern>\n\
</filter-mapping>' ${GEOSERVER_INSTALL_DIR}/WEB-INF/web.xml


# Tomcat environment
ENV CATALINA_OPTS "-server -Djava.awt.headless=true \
	-Xms768m -Xmx1560m -XX:+UseConcMarkSweepGC -XX:NewSize=48m \
	-DGEOSERVER_DATA_DIR=${GEOSERVER_DATA_DIR}"


# Create tomcat user to avoid root access. 
RUN addgroup --gid 1099 tomcat && useradd -m -u 1099 -g tomcat tomcat \
    && chown -R tomcat:tomcat . \
    && chown -R tomcat:tomcat ${GEOSERVER_DATA_DIR} \
    && chown -R tomcat:tomcat ${GEOSERVER_INSTALL_DIR} \
    && chown -R tomcat:tomcat ${RAW_DATA_DIR}


ADD start.sh /usr/local/bin/start.sh
ENTRYPOINT [ "/bin/sh", "/usr/local/bin/start.sh"]

VOLUME ["${GEOSERVER_DATA_DIR}", "${GEOSERVER_EXT_DIR}", "${RAW_DATA_DIR}"]

EXPOSE 8080

