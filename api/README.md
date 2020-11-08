# SDA Sea Ice Information Service (SIIS) API

SDA Sea-Ice Information - Backend services: GeoServer / Catalogue / Subscription / Replication

## Python API Environment

* Python 3.6+
* Ideally use of virtual environment to setup:
  * `python3 -m venv api_env`
  * `source api_env/bin/activate`
  * `pip3 install --upgrade pip`

### Requirements

```
pip3 install flask
pip3 install connexion
pip3 install connexion[swagger-ui]
pip3 install Flask-SQLAlchemy==2.1
pip3 install flask-marshmallow marshmallow-sqlalchemy marshmallow
pip3 install flask_cors
pip3 install postgres
```

### Configuration

* Edit `api/config.py` to choose between local SQlite or local Postgres DB

### Execute

```
cd api
python3 api.py
```

* API documentation: http://127.0.0.1:5000/api/ui
* API endpoint: http://127.0.0.1:5000/api


## Docker

### API

* `cd api`
* `docker build -t siis-api:v0.4 .`
* `docker run -dit --rm -p 5000:5000 --name siis siis-api:v0.4`

### Postgres/PostGIS

* `cd db`
* `docker build -t siis-postgis .`
* `docker run --name siis-postgis -e POSTGRES_PASSWORD=postgres --rm -p 5432:5432 siis-postgis`

### GeoServer

* `cd gs`
* `docker build -t siis-geoserver .`
* `docker run --name gs -p 8080:8080 \
  -e GEOSERVER_NODE_OPTS="id:Local (Docker);background:purple;color:white" \
  -v ${PWD}/exts:/var/local/geoserver-exts/ \
  -v ${PWD}/../data/geoserver:/var/local/geoserver \
  -v ${PWD}/../data/raw:/data \
  siis-geoserver `

### docker-compose

To start the services invoke

* `docker-compose up`

Currently the following services are deployed:
* SIIS API
* SIIS Postgres/PostGIS database backend
* SIIS GeoServer 2.18.0

## API documentation

Either
* see `api/api/swagger.yml`
* Or alternatively, when API docker container deployed, visit 'http://localhost:5000/api/ui'


## GeoServer

### Example layers

#### siis.sic.s - Sea ice concentration / University of Bremen

Currently 3 sample granules:
* 2020-01-01
* 2020-01-02
* 2020-01-03

Sample request:
`localhost:8080/geoserver/siis/wms?time=2020-01-01&service=WMS&version=1.1.0&request=GetMap&layers=siis%3Asic_s&bbox=-5893307.537463192%2C-5893307.537463192%2C5893307.537463192%2C5893307.537463192&width=768&height=768&srs=EPSG%3A3031&styles=&format=application/openlayers`


#### siis.s1.s - S1 SAR / Antarctic

Currently 5 sample granules

* S1A_EW_GRDM_1SSH_20200102T010200_E5EB_S_1.8bit.jp2
* S1A_EW_GRDM_1SSH_20200103T080758_A9BF_S_1.8bit.jp2
* S1A_EW_GRDM_1SSH_20200103T080858_31E4_S_1.8bit.jp2
* S1A_EW_GRDM_1SSH_20200103T080958_9E55_S_1.8bit.jp2
* S1A_IW_GRDH_1SSH_20200101T082717_1D18_S_1.8bit.jp2

`http://localhost:8080/geoserver/siis/wms?time=2020-01-03T08:08:58Z&service=WMS&version=1.1.0&request=GetMap&layers=siis%3As1_s&bbox=-3333134.027630277%2C-3333134.027630277%2C3333134.027630277%2C3333134.027630277&width=768&height=768&srs=EPSG%3A3031&styles=&format=application/openlayers`

#### siis.ic-nor.s - Antarctic Ice chart / MetNorway

Currently 3 sample granules

* NIS_antarctic_20200106_pl_a_antarctic.3031.shp
* NIS_antarctic_20200113_pl_a_antarctic.3031.shp
* NIS_antarctic_20200120_pl_a_antarctic.3031.shp

`localhost:8080/geoserver/siis/wms?time=2020-01-13&service=WMS&version=1.1.0&request=GetMap&layers=siis%3Aic_nor_s&bbox=-3424147.25%2C-114786.75%2C505839.90625%2C3422201.5&width=768&height=691&srs=EPSG%3A3031&styles=&format=application/openlayers`
