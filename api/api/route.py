from pathlib import Path
from tempfile import TemporaryDirectory
from uuid import uuid4

from bas_metadata_library.standards.iec_pas_61174_0_v1 import MetadataRecordConfigV1, MetadataRecord
from flask import request, abort, Response, make_response, send_file


def convert():
    source_format: str = request.headers.get('Content-Type')
    destination_format: str = request.headers.get('Accept')

    if source_format == 'application/geo+json' and destination_format == 'application/rtz':
        return Response(_convert_geojson_to_rtz(geojson=request.json), mimetype='text/rtz')
    elif source_format == 'application/geo+json' and destination_format == 'application/rtzp':
        with TemporaryDirectory() as tmp_dir:
            rtzp_path = Path(tmp_dir).joinpath('siis-route.rtzp')
            _convert_geojson_to_rtzp(geojson=request.json, path=rtzp_path)
            return make_response(send_file(rtzp_path, attachment_filename="siis-route.zip", as_attachment=True))
    elif source_format == 'application/rtz' and destination_format == 'application/geo+json':
        return _convert_rtz_to_geojson(record_str=request.data.decode())
    elif source_format == 'application/rtz' and destination_format == 'application/rtzp':
        with TemporaryDirectory() as tmp_dir:
            rtzp_path = Path(tmp_dir).joinpath('siis-route.rtzp')
            _convert_rtz_to_rtzp(record_str=request.data.decode(), path=rtzp_path)
            return make_response(send_file(rtzp_path, attachment_filename="siis-route.zip", as_attachment=True))
    elif source_format == 'application/rtzp' and destination_format == 'application/geo+json':
        with TemporaryDirectory() as tmp_dir:
            rtzp_path = Path(tmp_dir).joinpath('siis-route.rtzp')
            with open(str(rtzp_path), mode='wb') as rtzp_file:
                rtzp_file.write(request.data)
            return _convert_rtzp_to_geojson(path=rtzp_path)
    elif source_format == 'application/rtzp' and destination_format == 'application/rtz':
        with TemporaryDirectory() as tmp_dir:
            rtzp_path = Path(tmp_dir).joinpath('siis-route.rtzp')
            with open(str(rtzp_path), mode='wb') as rtzp_file:
                rtzp_file.write(request.data)
            return Response(_convert_rtzp_to_rtz(path=rtzp_path), mimetype='text/rtz')

    abort(406)


def _convert_geojson_to_rtz_config(geojson: dict) -> dict:
    rtz_config = {'route_name': geojson['properties']['route_name'], 'waypoints': []}
    for index, coordinate in enumerate(geojson['geometry']['coordinates']):
        rtz_config['waypoints'].append({'id': index, 'revision': 0, 'position': {'lat': coordinate[1], 'lon': coordinate[0]}})
    return rtz_config


def _convert_rtz_config_geojson(config: dict) -> dict:
    feature = {
      "type": "Feature",
      "geometry": {
        "type": "LineString",
        "coordinates": []
      },
      "properties": {
        "route_name": config['route_name']
      },
      "id": str(uuid4())
    }
    for waypoint in config['waypoints']:
        feature['geometry']['coordinates'].append([waypoint['position']['lon'], waypoint['position']['lat']])

    return feature


def _convert_geojson_to_rtz(geojson: dict) -> str:
    configuration = MetadataRecordConfigV1(**_convert_geojson_to_rtz_config(geojson=geojson))
    record = MetadataRecord(configuration=configuration)
    document = record.generate_xml_document()
    return document.decode()


def _convert_geojson_to_rtzp(geojson: dict, path: Path) -> None:
    configuration = MetadataRecordConfigV1(**_convert_geojson_to_rtz_config(geojson=geojson))
    record = MetadataRecord(configuration=configuration)
    record.generate_rtzp_archive(file=path)


def _convert_rtz_to_geojson(record_str: str) -> dict:
    record = MetadataRecord(record=record_str)
    configuration = record.make_config()
    return _convert_rtz_config_geojson(config=configuration.config)


def _convert_rtz_to_rtzp(record_str: str, path: Path) -> None:
    record = MetadataRecord(record=record_str)
    configuration = record.make_config()
    record = MetadataRecord(configuration=configuration)
    record.generate_rtzp_archive(file=path)


def _convert_rtzp_to_geojson(path: Path) -> dict:
    record = MetadataRecord()
    record.load_from_rtzp_archive(file=path)
    configuration = record.make_config()
    return _convert_rtz_config_geojson(config=configuration.config)


def _convert_rtzp_to_rtz(path: Path) -> str:
    record = MetadataRecord()
    record.load_from_rtzp_archive(file=path)
    return record.generate_xml_document().decode()
