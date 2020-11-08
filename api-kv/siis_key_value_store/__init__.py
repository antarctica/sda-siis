from http import HTTPStatus
from typing import Dict

from flask import Flask, Response, request, make_response, jsonify
from flask_cors import CORS


class KeyNotSet(Exception):
    pass


class KeyAlreadySet(Exception):
    pass


class KeyValueStore:
    """
    Simple Key Value store (Abstract)

    Supports creating, updating, retrieving and deleting keys, either individually or in bulk.

    This is intended as an abstract class which other class will extend to implement a backing store (e.g. a file or
    database) by overloading the `_flush()` method.
    """

    def __init__(self):
        self.store = {}

    def _flush(self):
        raise NotImplemented()

    def get_all(self) -> Dict[str, str]:
        return self.store

    def set_all(self, store: Dict[str, str], overwrite: bool = False) -> None:
        if bool(self.store) and not overwrite:
            raise KeyAlreadySet()

        self.store = store
        self._flush()

    def get(self, key: str) -> str:
        try:
            return self.store[key]
        except KeyError:
            raise KeyNotSet()

    def set(self, key: str, value: str, overwrite: bool = False) -> None:
        if key in self.store.keys() and not overwrite:
            raise KeyAlreadySet()
        if key not in self.store.keys() and overwrite:
            raise KeyNotSet()

        self.store[key] = value
        self._flush()

    def remove(self, key: str) -> None:
        if key not in self.store.keys():
            raise KeyNotSet()
        del self.store[key]

    def reset(self) -> None:
        self.store.clear()
        self._flush()


class MemoryKeyValueStore(KeyValueStore):
    """
    Simple Key Value store (In Memory)

    Example of a Key Value store that doesn't actually persist data (and is therefore only suitable for testing).
    """

    def _flush(self):
        pass


def create_app() -> Flask:
    """
    Application factory

    This application uses the application factory pattern [1].

    In addition to various routes and commands (registered directly or via blueprints).

    [1] https://flask.palletsprojects.com/en/1.1.x/patterns/appfactories/

    :rtype Flask
    :return: Flask application
    """
    app = Flask(__name__)
    app.kv_store = MemoryKeyValueStore()
    CORS(app)

    @app.route("/kv/<string:key>", methods=["GET"])
    def key_value_read_key(key: str) -> Response:
        try:
            payload = {"data": {key: app.kv_store.get(key=key)}}
            return make_response(jsonify(payload), HTTPStatus.OK)
        except KeyNotSet:
            return make_response(jsonify({"error": f"Key '{key}' not found."}), HTTPStatus.NOT_FOUND)

    @app.route("/kv/<string:key>", methods=["POST", "PUT"])
    def key_value_write_key(key: str) -> Response:
        try:
            _overwrite = False
            _status = HTTPStatus.CREATED

            if request.method == "PUT":
                _overwrite = True
                _status = HTTPStatus.NO_CONTENT

            payload = request.get_json()
            app.kv_store.set(key=key, value=payload["data"], overwrite=_overwrite)
            return Response(response=None, status=_status)
        except KeyError:
            return make_response(jsonify({"error": "No 'data' element in payload."}), HTTPStatus.BAD_REQUEST)
        except KeyNotSet:
            return make_response(jsonify({"error": f"Key '{key}' not found."}), HTTPStatus.NOT_FOUND)
        except KeyAlreadySet:
            return make_response(
                jsonify({"error": f"Key '{key}' already set, use PUT to update."}), HTTPStatus.BAD_REQUEST
            )

    @app.route("/kv/<string:key>", methods=["DELETE"])
    def key_value_delete_key(key: str) -> Response:
        try:
            app.kv_store.remove(key=key)
            return Response(response=None, status=HTTPStatus.NO_CONTENT)
        except KeyNotSet:
            return make_response(jsonify({"error": f"Key '{key}' not found."}), HTTPStatus.NOT_FOUND)

    @app.route("/kv", methods=["GET"])
    def key_value_read_all() -> Response:
        payload = {"data": app.kv_store.get_all()}
        return make_response(jsonify(payload), HTTPStatus.OK)

    @app.route("/kv", methods=["POST", "PUT", "PATCH"])
    def key_value_write_all() -> Response:
        try:
            _overwrite = False
            _status = HTTPStatus.CREATED
            payload = request.get_json()
            data = payload["data"]

            if request.method == "PUT":
                _overwrite = True
                _status = HTTPStatus.NO_CONTENT
            elif request.method == "PATCH":
                _overwrite = True
                _status = HTTPStatus.NO_CONTENT
                data = app.kv_store.get_all()
                data = {**data, **payload["data"]}

            app.kv_store.set_all(store=data, overwrite=_overwrite)
            return Response(response=None, status=_status)
        except KeyError:
            return make_response(jsonify({"error": "No 'data' element in payload."}), HTTPStatus.BAD_REQUEST)
        except KeyAlreadySet:
            return make_response(
                jsonify({"error": "Key-values not empty, use PUT or PATCH to update."}), HTTPStatus.BAD_REQUEST
            )

    @app.route("/kv", methods=["DELETE"])
    def key_value_delete_all() -> Response:
        app.kv_store.reset()
        return Response(response=None, status=HTTPStatus.NO_CONTENT)

    return app
