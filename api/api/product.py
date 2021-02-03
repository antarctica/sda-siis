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
            product = Product.query.order_by(Product.code).limit(int(limit)).all()
    else:
        if isinstance(hemi, str):
            product = (
                Product.query.filter(Product.hemisphere == hemi.upper())
                .order_by(Product.code)
                .all()
            )
        else:
            product = Product.query.order_by(Product.code).all()

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


def read_one_granules(code, limit=None, maxage=None):
    """
    This function responds to a request for /api/products/{code}/granules
    with one matching product returning all granules for this product

    :param code:   SIIS product code of product
    :return:            granules matching product code
    """

    # Calculate earliest timestamp if maxage is supplied
    if isinstance(maxage, float):
        pass
        d = datetime.utcnow() - timedelta(hours=maxage)
        aged_timestamp = d.isoformat()
    else:
        aged_timestamp = "2000-01-01T00:00:00"

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
