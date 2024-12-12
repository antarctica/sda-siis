from datetime import datetime
from config import db, ma
from sqlalchemy import true, event, types
from marshmallow import fields
from enum import Enum


class Status(str, Enum):
    offline = "offline"
    online = "online"
    loading = "loading"
    outdated = "outdated"  # special case - calculated for the layer when the expected timeframe is exceeded.
    error = "error"
    not_available = "n/a"
    hr_requested = "hr_requested"
    hr_pending = "hr_pending"
    hr_processing = "hr_processing"
    hr_online = "hr_online"


class StatusType(types.TypeDecorator):
    impl = types.String

    def process_result_value(self, value, dialect):
        if value not in [status.value for status in Status]:
            return Status.error.value
        return value


class Granule(db.Model):
    __tablename__ = "granule"
    uuid = db.Column(db.String(), primary_key=True)
    productcode = db.Column(db.String())
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
    status = db.Column(StatusType)
    geom_extent = db.Column(db.String())
    geojson_extent = db.Column(db.JSON())


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
    zipped = ma.auto_field()
    productname = ma.auto_field()
    ts_catingest = ma.auto_field()
    ts_dlrequest = ma.auto_field()
    ts_downloaded = ma.auto_field()
    ts_gsingest = ma.auto_field()
    status = ma.auto_field()
    geom_extent = ma.auto_field()
    geojson_extent = ma.auto_field()


class Product(db.Model):
    __tablename__ = "product"
    # Core identification
    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String())
    label = db.Column(db.String())
    attribution = db.Column(db.String())
    hemisphere = db.Column(db.String(1))
    status = db.Column(StatusType)

    # GeoServer configuration
    gs_layername = db.Column(db.String())
    gs_wmsendpoint = db.Column(db.String())
    gs_wfsendpoint = db.Column(db.String())
    gs_wmtsendpoint = db.Column(db.String())
    style = db.Column(db.String())

    # Supported formats and types
    layer_display_type = db.Column(db.String())
    formats = db.Column(db.ARRAY(db.String()))
    srss = db.Column(db.ARRAY(db.Integer()))
    types = db.Column(db.ARRAY(db.String()))

    # Display and rendering properties
    show_on_startup = db.Column(db.Boolean())
    default_opacity = db.Column(db.Float())
    default_z = db.Column(db.Integer())
    granule_footprint_color = db.Column(db.String())
    iws_viewer_template = db.Column(db.String())

    # Legend configuration
    haslegend = db.Column(db.Boolean())
    legend_graphic_params = db.Column(db.String())

    # Time and data properties
    temporal_mode = db.Column(db.String())
    timestamps = db.Column(db.ARRAY(db.DateTime()))
    default_timeframe = db.Column(db.Integer())
    highres_available = db.Column(db.Boolean())

    # Spatial properties
    geom_extent = db.Column(db.String())

    # deprecated
    render_exclusive = db.Column(db.Boolean())
    static = db.Column(db.Boolean())


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
