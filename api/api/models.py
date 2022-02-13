from datetime import datetime
from config import db, ma
from sqlalchemy import true
from marshmallow import fields


class Granule(db.Model):
    __tablename__ = "granule"
    uuid = db.Column(db.String(), primary_key=True)
    # id = db.Column(db.String(), primary_key=True)
    productcode = db.Column(db.String())
    timestamp = db.Column(db.DateTime())
    downloadable = db.Column(db.Boolean())
    downloaded = db.Column(db.Boolean())
    filename_dl = db.Column(db.String())
    size_dl = db.Column(db.Integer())
    size_downloaded = db.Column(db.Integer())
    md5_dl = db.Column(db.String())
    zipped = db.Column(db.Boolean())
    productname = db.Column(db.String())
    ts_catingest = db.Column(db.DateTime())
    ts_dlstart = db.Column(db.DateTime())
    ts_downloaded = db.Column(db.DateTime())
    ts_gsingest = db.Column(db.DateTime())
    ts_dlrequest = db.Column(db.DateTime())
    hr_requested = db.Column(db.Boolean())
    status = db.Column(db.String())
    geom_extent = db.Column(db.String())
    geom3031 = db.Column(db.String())
    geom3413 = db.Column(db.String())


class GranuleSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Granule
        sqla_session = db.session
        load_instance = True

    id = fields.String(attribute="uuid")  # For aliasing db uuid field to id
    # as required by frontend
    # See issue #46
    productcode = ma.auto_field()
    timestamp = ma.auto_field()
    downloadable = ma.auto_field()
    downloaded = ma.auto_field()
    filename_dl = ma.auto_field()
    size_dl = fields.Integer()
    size_downloaded = fields.Integer()
    zipped = ma.auto_field()
    productname = ma.auto_field()
    ts_catingest = ma.auto_field()
    ts_dlstart = ma.auto_field()
    ts_downloaded = ma.auto_field()
    ts_gsingest = ma.auto_field()
    ts_dlrequest = ma.auto_field()
    hr_requested = ma.auto_field()
    status = ma.auto_field()
    geom_extent = ma.auto_field()
    geom3031 = ma.auto_field()
    geom3413 = ma.auto_field()

class Product(db.Model):
    __tablename__ = "product"
    id = db.Column(db.Integer, primary_key=True)
    #    code = db.Column(db.String(), db.ForeignKey('granule.productcode'))
    code = db.Column(db.String())
    label = db.Column(db.String())
    attribution = db.Column(db.String())
    formats = db.Column(db.ARRAY(db.String()))
    srss = db.Column(db.ARRAY(db.Integer()))
    style = db.Column(db.String())
    gs_layername = db.Column(db.String())
    gs_tempwmsendpoint = db.Column(db.String())
    gs_tempwfsendpoint = db.Column(db.String())
    gs_tempwmtsendpoint = db.Column(db.String())
    types = db.Column(db.ARRAY(db.String()))
    timestamps = db.Column(db.ARRAY(db.DateTime()))
    haslegend = db.Column(db.Boolean())
    hemisphere = db.Column(db.String(1))
    static = db.Column(db.Boolean())
    default_timeframe = db.Column(db.Integer())
    status = db.Column(db.String())
    render_exclusive = db.Column(db.Boolean())
    highres_available = db.Column(db.Boolean())
    legend_graphic_params = db.Column(db.String())
    show_on_startup = db.Column(db.Boolean())
    default_opacity = db.Column(db.Float())
    default_z = db.Column(db.Integer)
    geom_extent = db.Column(db.String())

    # granules = db.relationship(
    #     'Granule',
    #     backref = 'product',
    #     cascade = 'all, delete',
    #     order_by='desc(Granule.timestamp)'
    # )


class ProductSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Product
        sqla_session = db.session
        load_instance = True


class KeyValue(db.Model):
    __tablename__ = "keyvalue"
    k = db.Column(db.String(), primary_key=True)
    v = db.Column(db.String())


class KeyValueSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = KeyValue
        sqla_session = db.session
        load_instance = True
