"""
This is the granule module and supports all the REST actions for the
granule data
"""

from flask import make_response, abort
from config import db
from models import Granule, GranuleSchema, Product
from datetime import datetime, timedelta
from sqlalchemy import desc
from typing import Optional


def build_date_range_query(
    start_date: datetime, end_date: datetime, limit: Optional[int] = None
):
    """Helper to build date range filtered query

    Args:
        start_date: Start of date range
        end_date: End of date range
        limit: Optional result limit
    """
    start_str = start_date.strftime("%Y-%m-%d %H:%M:%S")
    end_str = end_date.strftime("%Y-%m-%d %H:%M:%S")

    print(f"Filtering between: {start_str} and {end_str}")

    query = Granule.query.filter(
        Granule.timestamp.between(start_str, end_str)
    ).order_by(desc(Granule.timestamp))

    # Print the actual SQL query being generated
    print(f"SQL Query: {query}")

    if limit:
        query = query.limit(limit)
    return query


def parse_date(date_str: str, param_name: str) -> datetime:
    """Helper to parse date strings

    Args:
        date_str: Date string in YYYY-MM-DD format
        param_name: Name of parameter for error messages

    Returns:
        Parsed datetime object

    Raises:
        404 abort if date cannot be parsed
    """
    try:
        return datetime.strptime(date_str, "%Y-%m-%d")
    except ValueError:
        abort(
            404,
            f"Parameter {param_name} not well formatted. Use ISO string YYYY-MM-DD: {date_str}",
        )


def read_all(limit=None, maxage=None, date=None, date_range=None):
    """Get granules with optional filtering

    Args:
        limit: Optional limit on number of results
        maxage: Optional maximum age in hours
        date: Optional specific date to filter by
        date_range: Optional date range to filter by

    Returns:
        JSON serialized list of granules
    """
    if date_range:
        try:
            start_date, end_date = date_range.split("/")
            print(f"Received date range: {start_date} to {end_date}")

            start = parse_date(start_date, "date_range")
            end = (
                parse_date(end_date, "date_range")
                + timedelta(days=1)
                - timedelta(seconds=1)
            )
            query = build_date_range_query(start, end, limit)
        except ValueError:
            abort(404, "Date range must be in format YYYY-MM-DD/YYYY-MM-DD")

    elif date:
        start = parse_date(date, "date")
        end = start + timedelta(days=1) - timedelta(seconds=1)
        query = build_date_range_query(start, end, limit)

    else:
        aged_timestamp = (
            (datetime.utcnow() - timedelta(hours=maxage)).isoformat()
            if isinstance(maxage, float)
            else "2000-01-01T00:00:00"
        )

        query = Granule.query.filter(Granule.timestamp > aged_timestamp).order_by(
            desc(Granule.timestamp)
        )

        if limit:
            query = query.limit(limit)

    granules = query.all()
    return GranuleSchema(many=True).dump(granules)


def read_one(uuid: str):
    """Get a single granule by UUID

    Args:
        uuid: Granule UUID

    Returns:
        JSON serialized granule data

    Raises:
        404 if granule not found
    """
    granule = Granule.query.filter(Granule.uuid == uuid).one_or_none()

    if not granule:
        abort(404, f"Granule not found for UUID: {uuid}")

    return GranuleSchema().dump(granule)


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


def request_message(uuid: str):
    """Create JSON request message and put to out messages folder

    Args:
        uuid: Granule UUID to request
    """
    print("create request message")  # TODO: Implement actual message creation
