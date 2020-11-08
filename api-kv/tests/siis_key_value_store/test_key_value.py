from http import HTTPStatus

import pytest


@pytest.mark.usefixtures("app_client")
def test_read_all_keys(app_client):
    result = app_client.get("/kv")
    assert result.status_code == HTTPStatus.OK
    assert result.json == {"data": {}}

    # Add some data
    app_client.post("/kv/test.a", json={"data": "test-value1"})
    app_client.post("/kv/test.b", json={"data": "test-value2"})

    result = app_client.get("/kv")
    assert result.status_code == HTTPStatus.OK
    assert result.json == {"data": {"test.a": "test-value1", "test.b": "test-value2"}}


@pytest.mark.usefixtures("app_client")
def test_read_single_key(app_client):
    # Add some data
    app_client.post("/kv/test.key", json={"data": "test-value"})

    result = app_client.get("/kv/test.key")
    assert result.status_code == HTTPStatus.OK
    assert result.json == {"data": {"test.key": "test-value"}}


@pytest.mark.usefixtures("app_client")
def test_read_single_key_not_set(app_client):
    result = app_client.get("/kv/test.key")
    assert result.status_code == HTTPStatus.NOT_FOUND


@pytest.mark.usefixtures("app_client")
def test_create_multiple_keys(app_client):
    result = app_client.post("/kv", json={"data": {"test.a": "test-value1", "test.b": "test-value2"}})
    assert result.status_code == HTTPStatus.CREATED

    # verify key was inserted
    result = app_client.get("/kv/test.a")
    assert result.status_code == HTTPStatus.OK
    assert result.json == {"data": {"test.a": "test-value1"}}


@pytest.mark.usefixtures("app_client")
def test_create_multiple_keys_missing_data(app_client):
    result = app_client.post("/kv", json={})
    assert result.status_code == HTTPStatus.BAD_REQUEST
    assert result.json == {"error": "No 'data' element in payload."}


@pytest.mark.usefixtures("app_client")
def test_create_multiple_keys_already_set(app_client):
    # Pre-insert keys
    app_client.post("/kv", json={"data": {"test.a": "test-value1", "test.b": "test-value2"}})

    result = app_client.post("/kv", json={"data": {"test.a": "test-value1", "test.b": "test-value2"}})
    assert result.status_code == HTTPStatus.BAD_REQUEST
    assert result.json == {"error": "Key-values not empty, use PUT or PATCH to update."}


@pytest.mark.usefixtures("app_client")
def test_create_single_key(app_client):
    result = app_client.post("/kv/test.key", json={"data": "test-value"})
    assert result.status_code == HTTPStatus.CREATED

    # verify key was inserted
    result = app_client.get("/kv/test.key")
    assert result.status_code == HTTPStatus.OK
    assert result.json == {"data": {"test.key": "test-value"}}


@pytest.mark.usefixtures("app_client")
def test_create_single_key_missing_data(app_client):
    result = app_client.post("/kv/test.key", json={})
    assert result.status_code == HTTPStatus.BAD_REQUEST
    assert result.json == {"error": "No 'data' element in payload."}


@pytest.mark.usefixtures("app_client")
def test_create_single_key_already_set(app_client):
    # Pre-insert key
    app_client.post("/kv/test.key", json={"data": "test-value"})

    result = app_client.post("/kv/test.key", json={"data": "test-value"})
    assert result.status_code == HTTPStatus.BAD_REQUEST
    assert result.json == {"error": "Key 'test.key' already set, use PUT to update."}


@pytest.mark.usefixtures("app_client")
def test_replace_multiple_keys(app_client):
    # Pre-insert keys
    app_client.post("/kv", json={"data": {"test.a": "test-value1", "test.b": "test-value2"}})

    result = app_client.patch("/kv", json={"data": {"test.a": "test-value3"}})
    assert result.status_code == HTTPStatus.NO_CONTENT

    # verify key was updated
    result = app_client.get("/kv/test.a")
    assert result.status_code == HTTPStatus.OK
    assert result.json == {"data": {"test.a": "test-value3"}}

    # verify other keys were not updated
    result = app_client.get("/kv/test.b")
    assert result.status_code == HTTPStatus.OK
    assert result.json == {"data": {"test.b": "test-value2"}}


@pytest.mark.usefixtures("app_client")
def test_update_multiple_keys(app_client):
    # Pre-insert keys
    app_client.post("/kv", json={"data": {"test.a": "test-value1", "test.b": "test-value2"}})

    result = app_client.put("/kv", json={"data": {"test.a": "test-value3"}})
    assert result.status_code == HTTPStatus.NO_CONTENT

    # verify key was updated
    result = app_client.get("/kv/test.a")
    assert result.status_code == HTTPStatus.OK
    assert result.json == {"data": {"test.a": "test-value3"}}

    # verify other keys were not updated
    result = app_client.get("/kv/test.b")
    assert result.status_code == HTTPStatus.NOT_FOUND


@pytest.mark.usefixtures("app_client")
def test_update_single_key(app_client):
    # Pre-insert key
    app_client.post("/kv/test.key", json={"data": "test-value"})

    result = app_client.put("/kv/test.key", json={"data": "test-value2"})
    assert result.status_code == HTTPStatus.NO_CONTENT

    # verify key was updated
    result = app_client.get("/kv/test.key")
    assert result.status_code == HTTPStatus.OK
    assert result.json == {"data": {"test.key": "test-value2"}}


@pytest.mark.usefixtures("app_client")
def test_update_single_key_missing_data(app_client):
    # Pre-insert key
    app_client.post("/kv/test.key", json={"data": "test-value"})

    result = app_client.put("/kv/test.key", json={})
    assert result.status_code == HTTPStatus.BAD_REQUEST
    assert result.json == {"error": "No 'data' element in payload."}


@pytest.mark.usefixtures("app_client")
def test_update_single_key_unknown_key(app_client):
    result = app_client.put("/kv/test.key", json={"data": "test-value2"})
    assert result.status_code == HTTPStatus.NOT_FOUND
    assert result.json == {"error": "Key 'test.key' not found."}


@pytest.mark.usefixtures("app_client")
def test_delete_single_key(app_client):
    # Pre-insert key
    app_client.post("/kv/test.key", json={"data": "test-value"})

    result = app_client.delete("/kv/test.key")
    assert result.status_code == HTTPStatus.NO_CONTENT

    # verify key was removed
    result = app_client.get("/kv/test.key")
    assert result.status_code == HTTPStatus.NOT_FOUND


@pytest.mark.usefixtures("app_client")
def test_delete_single_key_unknown_key(app_client):
    result = app_client.delete("/kv/test.key")
    assert result.status_code == HTTPStatus.NOT_FOUND
    assert result.json == {"error": "Key 'test.key' not found."}
