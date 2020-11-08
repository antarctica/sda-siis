import pytest

from flask import Flask


@pytest.mark.usefixtures("app")
def test_app(app):
    assert app is not None
    assert isinstance(app, Flask)
