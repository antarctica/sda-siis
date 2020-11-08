import pytest

from siis_key_value_store import create_app


@pytest.fixture
def app():
    app = create_app()
    return app


@pytest.fixture
@pytest.mark.usefixtures("app")
def app_client(app):
    return app.test_client()
