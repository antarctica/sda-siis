# Script generates DB based on models.py
# Applicable for sqlite-based test DB
#
# !! Don't use for production system and Postgres !!
#

import os
from config import db
from models import Product, KeyValue

# Data to initialize database with
PRODUCT = [{"code": "siis.sic.s"}, {"code": "siis.s1.s"}, {"code": "siis.ic-nor.s"}]

KEYVALUE = [{"key": "key1", "value": "value1"}, {"key": "key2", "value": "value2"}]

# Delete database file if it exists currently
if os.path.exists("siis.db"):
    os.remove("siis.db")

# Create the database
db.create_all()

# Iterate over the PRODUCT structure and populate the database
for product in PRODUCT:
    # l = Product(code=product['code'])
    rec = Product(code=product["code"])
    db.session.add(rec)

# # Iterate over the KEYVALUE structure and populate the database
for keyvalue in KEYVALUE:
    rec = KeyValue(k=keyvalue["key"], v=keyvalue["value"])
    db.session.add(rec)

db.session.commit()
