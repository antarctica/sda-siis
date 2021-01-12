"""
This is the granule module and supports all the REST actions for the
granule data
"""

from flask import make_response, abort
from config import db
from models import Granule, GranuleSchema


def read_all():
    """
    This function responds to a request for /api/granule
    with the complete lists of granules

    :return:        json string of list of granules
    """
    # Create the list of granules from our data

    granule = Granule.query.order_by(Granule.timestamp).all()

    # Serialize the data for the response
    granule_schema = GranuleSchema(many=True)
    data = granule_schema.dump(granule)
    return data


def read_one(uuid):
    """
    This function responds to a request for /api/granule/{uuid}
    with one matching granule

    :param uuid:   granule uuid
    :return:            granule matching uuid
    """
    # Get the granule requested
    granule = Granule.query.filter(Granule.uuid == uuid).one_or_none()

    # Did we find a granule?
    if granule is not None:

        # Serialize the data for the response
        granule_schema = GranuleSchema()
        data = granule_schema.dump(granule)
        return data

    # Otherwise, nope, didn't find that granule
    else:
        abort(
            404,
            "Granule not found for UUID: {uuid}".format(uuid=uuid),
        )
