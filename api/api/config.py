import os
import connexion
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow

basedir = os.path.abspath(os.path.dirname(__file__))

# Create the Connexion application instance
connex_app = connexion.App(__name__, specification_dir=basedir)

# Get the underlying Flask app instance
app = connex_app.app

# Configure the SQLAlchemy part of the app instance

# Choose between local postgres instance and local SQLite DB
# app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://siis:siis@127.0.0.1/siis'
# app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://siis:siis@db/siis'
# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'siis.db')
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ["SERVICE_PG_CONN"]

app.config["SQLALCHEMY_ECHO"] = True
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Increasing the pool size from default 5 to 100 to prevent overrunning pool size limit
app.config["SQLALCHEMY_POOL_SIZE"] = 100

# Create the SQLAlchemy db instance
db = SQLAlchemy(app)

# Initialize Marshmallow
ma = Marshmallow(app)
