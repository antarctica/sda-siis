"""
This is the granule module and supports all the REST actions for the
granule data
"""

from flask import make_response, abort
from config import db
from models import Granule, GranuleSchema, Product
from datetime import datetime, timedelta
from sqlalchemy import desc


def read_all(limit=None, maxage=None, date=None):
    """
    This function responds to a request for /api/granule
    with the complete lists of granules

    :return:        json string of list of granules
    """

    # Calculate earliest timestamp if maxage is supplied
    if isinstance(maxage, float):
        d = datetime.utcnow() - timedelta(hours=maxage)
        aged_timestamp = d.isoformat()
    else:
        aged_timestamp = "2000-01-01T00:00:00"

    if isinstance(date, str):
        # Try to parse date
        try:
            date_start = datetime.strptime(date, "%Y-%m-%d")
        except ValueError:
            abort(
                404,
                "Parameter date not well formated. Use ISO string YYYY-MM-DD: {date}".format(
                    date=date
                ),
            )

        # Get the granules if a specific date is define
        date_end = date_start + timedelta(days=1) - timedelta(seconds=1)

        if isinstance(limit, int):
            granule = (
                Granule.query.filter(
                    Granule.timestamp.between(
                        date_start.strftime("%Y-%m-%d"),
                        date_end.strftime("%Y-%m-%d %H:%M:%S"),
                    )
                )
                .order_by(desc(Granule.timestamp))
                .limit(int(limit))
                .all()
            )
        else:
            granule = (
                Granule.query.filter(
                    Granule.timestamp.between(
                        date_start.strftime("%Y-%m-%d"),
                        date_end.strftime("%Y-%m-%d %H:%M:%S"),
                    )
                )
                .order_by(desc(Granule.timestamp))
                .all()
            )

    else:
        # Create the list of granules from our data
        if isinstance(limit, int):
            granule = (
                Granule.query.filter(Granule.timestamp > aged_timestamp)
                .order_by(desc(Granule.timestamp))
                .limit(int(limit))
                .all()
            )
        else:
            granule = (
                Granule.query.filter(Granule.timestamp > aged_timestamp)
                .order_by(desc(Granule.timestamp))
                .all()
            )

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


def request_highres(uuid):
    """
    This function responds to a request for /api/granule/{uuid}/request_highres
    Returns
      202: If request is accepted
      405: Error, if product does not support highres products

    :param uuid:   granule uuid
    """

    # Get the granule requested
    granule = Granule.query.filter(Granule.uuid == uuid).one_or_none()

    # Did we find a granule?
    if granule is not None:
        print("-- BLABLA --")
        print(granule.productcode)
        product = Product.query.filter(
            Product.code == granule.productcode
        ).one_or_none()
        if product is not None:
            print("  product found - highres: %s" % product.highres_available)
            if product.highres_available:
                request_message(uuid)
                return "Accepted", 202
            else:
                abort(
                    405,
                    "Product not supporting high resolution granules: {product}".format(
                        product=granule.productcode
                    ),
                )

    # Otherwise, nope, didn't find that granule
    else:
        abort(
            404,
            "Granule not found for UUID: {uuid}".format(uuid=uuid),
        )


def request_message(uuid):
    """
    create JSON request message and put to out messages folder
    """
    print("create request message")
