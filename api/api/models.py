from datetime import datetime
from config import db, ma
from sqlalchemy import true


class Granule(db.Model):
    __tablename__ = "granule"
    uuid = db.Column(db.String(), primary_key=True)
    layercode = db.Column(db.String())
    timestamp = db.Column(db.DateTime())
    downloadable = db.Column(db.Integer())
    downloaded = db.Column(db.Integer())
    filename_dl = db.Column(db.String())
    size_dl = db.Column(db.Integer())
    zipped = db.Column(db.Integer())
    productname = db.Column(db.String())
    ts_catingest = db.Column(db.DateTime())
    ts_dlrequest = db.Column(db.DateTime())
    ts_downloaded = db.Column(db.DateTime())
    ts_gsingest = db.Column(db.DateTime())
    geom_extent = db.Column(db.String())


class GranuleSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Granule
        sqla_session = db.session
        load_instance = True


class Layerdef(db.Model):
    __tablename__ = "layerdef"
    id = db.Column(db.Integer, primary_key=True)
    #    code = db.Column(db.String(), db.ForeignKey('granule.layercode'))
    code = db.Column(db.String())
    label = db.Column(db.String())
    attribution = db.Column(db.String())
    formats = db.Column(db.String())
    srss = db.Column(db.String())
    gs_layername = db.Column(db.String())
    gs_tempwmsendpoint = db.Column(db.String())
    gs_tempwfsendpoint = db.Column(db.String())
    gs_tempwmtsendpoint = db.Column(db.String())
    types = db.Column(db.String())
    timestamps = db.Column(db.String())
    #    timestamps = db.Column(db.DateTime())
    haslegend = db.Column(db.String())
    hemisphere = db.Column(db.String(1))
    geom_extent = db.Column(db.String())

    # granules = db.relationship(
    #     'Granule',
    #     backref = 'layerdef',
    #     cascade = 'all, delete',
    #     order_by='desc(Granule.timestamp)'
    # )


class LayerdefSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Layerdef
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
