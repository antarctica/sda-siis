"""
This is the product module and supports all the REST actions for the
product data
"""

from flask import make_response, abort, jsonify
from config import db
from models import Product, ProductSchema
from models import Granule, GranuleSchema


def read_all():
    """
    This function responds to a request for /api/products
    with the complete lists of products

    :return:        json string of list of products
    """
    # Create the list of products from our data

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


def read_one_granules(code):
    """
    This function responds to a request for /api/products/{code}/granules
    with one matching product returning all granules for this product

    :param code:   SIIS product code of product
    :return:            granules matching product code
    """

    # Get the granules requested

    granule = (
        Granule.query.filter(Granule.productcode == code)
        .order_by(Granule.timestamp)
        .all()
    )

    # Serialize the data for the response
    granule_schema = GranuleSchema(many=True)
    data = granule_schema.dump(granule)
    return data
