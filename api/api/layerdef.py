"""
This is the layerdef module and supports all the REST actions for the
layerdef data
"""

from flask import make_response, abort, jsonify
from config import db
from models import Layerdef, LayerdefSchema
from models import Granule, GranuleSchema


def read_all():
    """
    This function responds to a request for /api/layerdef
    with the complete lists of layerdefs

    :return:        json string of list of layerdefs
    """
    # Create the list of layerdefs from our data

    layerdef = Layerdef.query.order_by(Layerdef.code).all()

    # Serialize the data for the response
    layerdef_schema = LayerdefSchema(many=True)
    data = layerdef_schema.dump(layerdef)

    return data


def read_one(code):
    """
    This function responds to a request for /api/layerdef/{code}
    with one matching layerdef

    :param code:   SIIS layer code of layer
    :return:            layer matching id
    """
    # Get the layer requested
    layerdef = Layerdef.query.filter(Layerdef.code == code).one_or_none()

    # Did we find a layer?
    if layerdef is not None:

        # Serialize the data for the response
        layerdef_schema = LayerdefSchema()
        data = layerdef_schema.dump(layerdef)
        return data

    # Otherwise, nope, didn't find that layer
    else:
        abort(
            404,
            "Layer not found for Code: {code}".format(code=code),
        )


def read_one_granules(code):
    """
    This function responds to a request for /api/layerdef/{code}/granules
    with one matching layerdef returning all granules for this layer

    :param code:   SIIS layer code of layer
    :return:            granules matching layerdef id
    """

    # Get the granules requested

    granule = (
        Granule.query.filter(Granule.layercode == code)
        .order_by(Granule.timestamp)
        .all()
    )

    # Serialize the data for the response
    granule_schema = GranuleSchema(many=True)
    data = granule_schema.dump(granule)
    return data
