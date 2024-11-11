"""
This is the product module and supports all the REST actions for the
product data
"""

from flask import make_response, abort, jsonify
from config import db
from models import Product, ProductSchema
from models import Granule, GranuleSchema
from datetime import datetime, timedelta
from sqlalchemy import desc


def read_all(limit=None, hemi=None):
    """
    This function responds to a request for /api/products
    with the complete lists of products

    :return:        json string of list of products
    """

    # Create the list of products from our data

    # Note: code is ugly with nested ifs. rectify
    if isinstance(limit, int):
        if isinstance(hemi, str):
            product = (
                Product.query.filter(Product.hemisphere == hemi.upper())
                .order_by(Product.code)
                .limit(int(limit))
                .all()
            )
        else:
            product = (
                Product.query.filter(
                    Product.hemisphere == "" or Product.hemisphere == None
                )
                .order_by(Product.code)
                .limit(int(limit))
                .all()
            )
    else:
        if isinstance(hemi, str):
            product = (
                Product.query.filter(Product.hemisphere == hemi.upper())
                .order_by(Product.code)
                .all()
            )
        else:
            product = (
                Product.query.filter(
                    Product.hemisphere == "" or Product.hemisphere == None
                )
                .order_by(Product.code)
                .all()
            )

    # Serialize the data for the response
    product_schema = ProductSchema(many=True)
    data = product_schema.dump(product)

    return data


def read_one(code):
    """
    This function responds to a request for /api/products/{code}
    with one matching product

    :param code:   SIIS product code of product
    :return:            product matching code
    """

    # Get the product requested
    product = Product.query.filter(Product.code == code).one_or_none()

    # Did we find a product?
    if product is not None:

        # Serialize the data for the response
        product_schema = ProductSchema()
        data = product_schema.dump(product)
        return data

    # Otherwise, nope, didn't find that product
    else:
        abort(
            404,
            "Product not found for Code: {code}".format(code=code),
        )


def read_one_granules(code, limit=None, maxage=None, date=None, date_range=None):
    """
    This function responds to a request for /api/products/{code}/granules
    with one matching product returning all granules for this product

    :param code:   SIIS product code of product
    :param date_range: Optional date range filter in format YYYY-MM-DD/YYYY-MM-DD
    :return:       granules matching product code
    """
    # Retrieve default_timeframe to filter last x hrs worth of products
    product = Product.query.filter(Product.code == code).one_or_none()

    # Check if product exists
    if product is None:
        abort(404, f"Product not found for Code: {code}")

    if date_range:
        try:
            start_date, end_date = date_range.split('/')
            print(f"Received date range: {start_date} to {end_date}")
            
            # Parse dates
            date_start = datetime.strptime(start_date, "%Y-%m-%d")
            date_end = datetime.strptime(end_date, "%Y-%m-%d") + timedelta(days=1) - timedelta(seconds=1)
            
            # Build query with date range
            query = (
                Granule.query.filter(Granule.productcode == code)
                .filter(
                    Granule.timestamp.between(
                        date_start.strftime("%Y-%m-%d %H:%M:%S"),
                        date_end.strftime("%Y-%m-%d %H:%M:%S")
                    )
                )
                .order_by(desc(Granule.timestamp))
            )
            
            if isinstance(limit, int):
                query = query.limit(limit)
                
            granule = query.all()
            
        except ValueError:
            abort(404, "Date range must be in format YYYY-MM-DD/YYYY-MM-DD")
            
    elif isinstance(date, str):
        # Original date filter logic
        try:
            date_start = datetime.strptime(date, "%Y-%m-%d")
        except ValueError:
            abort(404, "Parameter date not well formatted. Use ISO string YYYY-MM-DD: {date}")

        date_end = date_start + timedelta(days=1) - timedelta(seconds=1)

        if isinstance(limit, int):
            granule = (
                Granule.query.filter(Granule.productcode == code)
                .filter(
                    Granule.timestamp.between(
                        date_start.strftime("%Y-%m-%d %H:%M:%S"),
                        date_end.strftime("%Y-%m-%d %H:%M:%S")
                    )
                )
                .order_by(desc(Granule.timestamp))
                .limit(int(limit))
                .all()
            )
        else:
            granule = (
                Granule.query.filter(Granule.productcode == code)
                .filter(
                    Granule.timestamp.between(
                        date_start.strftime("%Y-%m-%d %H:%M:%S"),
                        date_end.strftime("%Y-%m-%d %H:%M:%S")
                    )
                )
                .order_by(desc(Granule.timestamp))
                .all()
            )
    else:
        # Calculate earliest timestamp if maxage is supplied
        if isinstance(maxage, float):
            if maxage == -1:
                aged_timestamp = "2000-01-01T00:00:00"
            elif maxage == 0:
                d = datetime.utcnow() - timedelta(hours=product.default_timeframe)
                aged_timestamp = d.isoformat()
            else:
                d = datetime.utcnow() - timedelta(hours=maxage)
                aged_timestamp = d.isoformat()
        else:
            d = datetime.utcnow() - timedelta(hours=product.default_timeframe)
            aged_timestamp = d.isoformat()

        # Get the granules requested
        if isinstance(limit, int):
            granule = (
                Granule.query.filter(Granule.productcode == code)
                .filter(Granule.timestamp > aged_timestamp)
                .order_by(desc(Granule.timestamp))
                .limit(int(limit))
                .all()
            )
        else:
            granule = (
                Granule.query.filter(Granule.productcode == code)
                .filter(Granule.timestamp > aged_timestamp)
                .order_by(desc(Granule.timestamp))
                .all()
            )

    # Serialize the data for the response
    granule_schema = GranuleSchema(many=True)
    data = granule_schema.dump(granule)
    return data
