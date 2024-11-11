# SIIS API

> Version 0.8

Open API v3 file for SIIS API

## Path Table

| Method | Path | Description |
| --- | --- | --- |
| GET | [/products](#getproducts) | Read the entire set of product definitions, sorted by SIIS product code |
| GET | [/products/{code}](#getproductscode) | Read one product definition |
| GET | [/products/{code}/granules](#getproductscodegranules) | Read all granules belonging to same product |
| GET | [/granules](#getgranules) | Read the entire set of granules, sorted by timestamp |
| GET | [/granules/{uuid}](#getgranulesuuid) | Read one granule record |
| POST | [/granules/{uuid}/request_highres](#postgranulesuuidrequest_highres) | Issue highres product download request to shore |
| GET | [/kvs](#getkvs) | Read the entire set of Key/Value pairs, sorted by key |
| DELETE | [/kvs](#deletekvs) | Delete all Key/Value pairs |
| GET | [/kvs/{key}](#getkvskey) | Read one Key/Value pair |
| DELETE | [/kvs/{key}](#deletekvskey) | Delete one Key/Value pair |
| PUT | [/kvs/{key}](#putkvskey) | Update a Key/Value pair |
| POST | [/kvs/{key}](#postkvskey) | Create a Key/Value pair |
| POST | [/routes/convert](#postroutesconvert) | Convert a route between formats for use in external systems |

## Reference Table

| Name | Path | Description |
| --- | --- | --- |
| product | [#/components/schemas/product](#componentsschemasproduct) |  |
| format | [#/components/schemas/format](#componentsschemasformat) | Array of WxS types available |
| srs | [#/components/schemas/srs](#componentsschemassrs) | GeoServer delivery SRS |
| type | [#/components/schemas/type](#componentsschemastype) | Array of WxS types available |
| products | [#/components/schemas/products](#componentsschemasproducts) |  |
| granule | [#/components/schemas/granule](#componentsschemasgranule) |  |
| granules | [#/components/schemas/granules](#componentsschemasgranules) |  |
| kv | [#/components/schemas/kv](#componentsschemaskv) |  |
| kvs | [#/components/schemas/kvs](#componentsschemaskvs) |  |

## Path Details

***

### [GET]/products

- Summary  
Read the entire set of product definitions, sorted by SIIS product code

- Description  
Read the entire set of product definitions, sorted by SIIS product code

#### Parameters(Query)

```ts
limit?: integer
```

```ts
hemi?: enum[N, n, S, s]
```

#### Responses

- 200 Successfully read product set operation

`application/json`

```ts
{
  // Id of the product
  id?: integer
  // SIIS product code
  code?: string
  // product label
  label?: string
  // product attribution
  attribution?: string
  // Array of WxS types available
  formats?: string[]
  // GeoServer layer style
  style?: string
  // GeoServer delivery SRS
  srss?: integer[]
  // Geoserver layer name
  gs_layername?: string
  // Geoserver WMS endpoint - temporary for testing
  gs_wmsendpoint?: string
  // Geoserver WFS endpoint - temporary for testing
  gs_wfsendpoint?: string
  // Geoserver WMTS endpoint - temporary for testing
  gs_wmtsendpoint?: string
  // Array of WxS types available
  types?: string[]
  // Array of timestamps available
  timestamps?: string
  // Does product has legend
  haslegend?: string
  // Hemisphere of product ('N'/'S'/'')
  hemisphere?: string
  // Static background product/layer without granules?
  static?: boolean
  // Default time filter in hours applied on granules for app rendering
  default_timeframe?: integer
  // Status of product feed, based on status of granules
  status?: enum[offline, online, loading, static, outdated, error]
  // Whether overlapping rendering of multiple active granules is allowed or exclusive render of one granule is required
  render_exclusive?: boolean
  // Indicated availability of a corresponding high-resolution granule
  highres_available?: boolean
  // Holds GeoServer WMS request parameters for legend graphic styling
  legend_graphic_params?: string
  // Show product in product list by default
  show_on_startup?: boolean
  // Default render opacity
  default_opacity?: number
  // Default z-index / layer stacking order for map rendering
  default_z?: integer
  // product footprint
  geom_extent?: string
}[]
```

***

### [GET]/products/{code}

- Summary  
Read one product definition

- Description  
Read one product definition

#### Responses

- 200 Successfully read product from product data operation

`application/json`

```ts
{
  // Id of the product
  id?: integer
  // SIIS product code
  code?: string
  // product label
  label?: string
  // product attribution
  attribution?: string
  // Array of WxS types available
  formats?: string[]
  // GeoServer layer style
  style?: string
  // GeoServer delivery SRS
  srss?: integer[]
  // Geoserver layer name
  gs_layername?: string
  // Geoserver WMS endpoint - temporary for testing
  gs_wmsendpoint?: string
  // Geoserver WFS endpoint - temporary for testing
  gs_wfsendpoint?: string
  // Geoserver WMTS endpoint - temporary for testing
  gs_wmtsendpoint?: string
  // Array of WxS types available
  types?: string[]
  // Array of timestamps available
  timestamps?: string
  // Does product has legend
  haslegend?: string
  // Hemisphere of product ('N'/'S'/'')
  hemisphere?: string
  // Static background product/layer without granules?
  static?: boolean
  // Default time filter in hours applied on granules for app rendering
  default_timeframe?: integer
  // Status of product feed, based on status of granules
  status?: enum[offline, online, loading, static, outdated, error]
  // Whether overlapping rendering of multiple active granules is allowed or exclusive render of one granule is required
  render_exclusive?: boolean
  // Indicated availability of a corresponding high-resolution granule
  highres_available?: boolean
  // Holds GeoServer WMS request parameters for legend graphic styling
  legend_graphic_params?: string
  // Show product in product list by default
  show_on_startup?: boolean
  // Default render opacity
  default_opacity?: number
  // Default z-index / layer stacking order for map rendering
  default_z?: integer
  // product footprint
  geom_extent?: string
}[]
```

***

### [GET]/products/{code}/granules

- Summary  
Read all granules belonging to same product

- Description  
Read all granules belonging to same product

#### Parameters(Query)

```ts
limit?: integer
```

```ts
maxage?: number
```

```ts
date?: string
```

```ts
date_range?: string
```

#### Responses

- 200 Successfully read granules from granule data operation

`application/json`

```ts
{
  // Granule UUID
  id?: integer
  // SIIS product code
  productcode?: string
  // Timestamp of granule
  timestamp?: string
  // Downloadable
  downloadable?: integer
  // Downloaded to local
  downloaded?: string
  // Filename of product for download package
  filename_dl?: string
  // Download file size
  size_dl?: integer
  // Zipped product for download
  zipped?: integer
  // Filename of product after extraction
  productname?: string
  // Timestamp of ingestion into shore-side catalogue
  ts_catingest?: string
  // Timestamp of download request to shore-side
  ts_dlrequest?: string
  // Timestamp of finished download ship-side
  ts_downloaded?: string
  // Timestamp of successful ship-side GeoServer ingest
  ts_gsingest?: string
  // Status of granule availability on vessel
  status?: enum[offline, online, loading, static, outdated, error, hr_requested, hr_pending, hr_processing, hr_online]
  // product footprint
  geom_extent?: string
  // product footprint in GeoJSON format (MultiPolygon)
  geojson_extent: {
    type?: enum[MultiPolygon]
    coordinates?: number[][][][]
  }
}[]
```

***

### [GET]/granules

- Summary  
Read the entire set of granules, sorted by timestamp

- Description  
Read the entire set of granules, sorted by timestamp

#### Parameters(Query)

```ts
limit?: integer
```

```ts
maxage?: number
```

```ts
date?: string
```

```ts
date_range?: string
```

#### Responses

- 200 Successfully read granule set operation

`application/json`

```ts
{
  // Granule UUID
  id?: integer
  // SIIS product code
  productcode?: string
  // Timestamp of granule
  timestamp?: string
  // Downloadable
  downloadable?: integer
  // Downloaded to local
  downloaded?: string
  // Filename of product for download package
  filename_dl?: string
  // Download file size
  size_dl?: integer
  // Zipped product for download
  zipped?: integer
  // Filename of product after extraction
  productname?: string
  // Timestamp of ingestion into shore-side catalogue
  ts_catingest?: string
  // Timestamp of download request to shore-side
  ts_dlrequest?: string
  // Timestamp of finished download ship-side
  ts_downloaded?: string
  // Timestamp of successful ship-side GeoServer ingest
  ts_gsingest?: string
  // Status of granule availability on vessel
  status?: enum[offline, online, loading, static, outdated, error, hr_requested, hr_pending, hr_processing, hr_online]
  // product footprint
  geom_extent?: string
  // product footprint in GeoJSON format (MultiPolygon)
  geojson_extent: {
    type?: enum[MultiPolygon]
    coordinates?: number[][][][]
  }
}[]
```

***

### [GET]/granules/{uuid}

- Summary  
Read one granule record

- Description  
Read one granule record

#### Responses

- 200 Successfully read granule from granule set opertion

`application/json`

```ts
{
  // Granule UUID
  id?: integer
  // SIIS product code
  productcode?: string
  // Timestamp of granule
  timestamp?: string
  // Downloadable
  downloadable?: integer
  // Downloaded to local
  downloaded?: string
  // Filename of product for download package
  filename_dl?: string
  // Download file size
  size_dl?: integer
  // Zipped product for download
  zipped?: integer
  // Filename of product after extraction
  productname?: string
  // Timestamp of ingestion into shore-side catalogue
  ts_catingest?: string
  // Timestamp of download request to shore-side
  ts_dlrequest?: string
  // Timestamp of finished download ship-side
  ts_downloaded?: string
  // Timestamp of successful ship-side GeoServer ingest
  ts_gsingest?: string
  // Status of granule availability on vessel
  status?: enum[offline, online, loading, static, outdated, error, hr_requested, hr_pending, hr_processing, hr_online]
  // product footprint
  geom_extent?: string
  // product footprint in GeoJSON format (MultiPolygon)
  geojson_extent: {
    type?: enum[MultiPolygon]
    coordinates?: number[][][][]
  }
}
```

***

### [POST]/granules/{uuid}/request_highres

- Summary  
Issue highres product download request to shore

- Description  
Issue highres product download request to shore

#### Responses

- 202 Accepted

- 404 Granule not found for UUID

- 405 Method not supported by product

***

### [GET]/kvs

- Summary  
Read the entire set of Key/Value pairs, sorted by key

- Description  
Read the entire set of Key/Value pairs, sorted by key

#### Responses

- 200 Read the entire set of Key/Value pairs, sorted by key

`application/json`

```ts
{
  // Key identifier of KV pair
  key?: string
  // Value of KV pair
  value?: string
}[]
```

***

### [DELETE]/kvs

- Summary  
Delete all Key/Value pairs

- Description  
Delete all Key/Value pairs

#### Responses

- 204 Successfully deleted all Key-Value pairs

***

### [GET]/kvs/{key}

- Summary  
Read one Key/Value pair

- Description  
Read one Key/Value pair

#### Responses

- 200 Successfully read Key/Value pair

`application/json`

```ts
{
  // Key identifier of KV pair
  key?: string
  // Value of KV pair
  value?: string
}
```

- 404 Not found

***

### [DELETE]/kvs/{key}

- Summary  
Delete one Key/Value pair

- Description  
Delete one Key/Value pair

#### Responses

- 204 Successfully deleted the Key-Value pair

***

### [PUT]/kvs/{key}

- Summary  
Update a Key/Value pair

- Description  
Update a Key/Value pair

#### Responses

- 200 Successfully updated Key/Value pair

`application/json`

```ts
{
  // Key identifier of KV pair
  key?: string
  // Value of KV pair
  value?: string
}
```

- 400 Request error

- 404 Not found

***

### [POST]/kvs/{key}

- Summary  
Create a Key/Value pair

- Description  
Create a Key/Value pair

#### RequestBody

- application/json

```ts
{
  // Key identifier of KV pair
  key?: string
  // Value of KV pair
  value?: string
}
```

#### Responses

- 201 Successfully created Key/Value pair

- 400 Request error

***

### [POST]/routes/convert

- Summary  
Convert a route between formats for use in external systems

- Description  
Converts a route from a source format, such as GeoJSON to a destination format, such as an RTZ.

#### Headers

```ts
accept: enum[application/geo+json, application/rtz, application/rtzp]
```

```ts
content-type: enum[application/geo+json, application/rtz, application/rtzp]
```

#### RequestBody

- application/geo+json

```ts
{}
```

- application/rtz

```ts
{}
```

- application/rtzp

```ts
{}
```

#### Responses

- 200 Successfully converted route

`application/geo+json`

```ts
{
}
```

`application/rtz`

```ts
{
  "type": "string"
}
```

`application/rtzp`

```ts
{
  "type": "string",
  "format": "binary"
}
```

## References

### #/components/schemas/product

```ts
{
  // Id of the product
  id?: integer
  // SIIS product code
  code?: string
  // product label
  label?: string
  // product attribution
  attribution?: string
  // Array of WxS types available
  formats?: string[]
  // GeoServer layer style
  style?: string
  // GeoServer delivery SRS
  srss?: integer[]
  // Geoserver layer name
  gs_layername?: string
  // Geoserver WMS endpoint - temporary for testing
  gs_wmsendpoint?: string
  // Geoserver WFS endpoint - temporary for testing
  gs_wfsendpoint?: string
  // Geoserver WMTS endpoint - temporary for testing
  gs_wmtsendpoint?: string
  // Array of WxS types available
  types?: string[]
  // Array of timestamps available
  timestamps?: string
  // Does product has legend
  haslegend?: string
  // Hemisphere of product ('N'/'S'/'')
  hemisphere?: string
  // Static background product/layer without granules?
  static?: boolean
  // Default time filter in hours applied on granules for app rendering
  default_timeframe?: integer
  // Status of product feed, based on status of granules
  status?: enum[offline, online, loading, static, outdated, error]
  // Whether overlapping rendering of multiple active granules is allowed or exclusive render of one granule is required
  render_exclusive?: boolean
  // Indicated availability of a corresponding high-resolution granule
  highres_available?: boolean
  // Holds GeoServer WMS request parameters for legend graphic styling
  legend_graphic_params?: string
  // Show product in product list by default
  show_on_startup?: boolean
  // Default render opacity
  default_opacity?: number
  // Default z-index / layer stacking order for map rendering
  default_z?: integer
  // product footprint
  geom_extent?: string
}
```

### #/components/schemas/format

```ts
{
  "type": "string",
  "description": "Array of WxS types available"
}
```

### #/components/schemas/srs

```ts
{
  "type": "integer",
  "description": "GeoServer delivery SRS"
}
```

### #/components/schemas/type

```ts
{
  "type": "string",
  "description": "Array of WxS types available"
}
```

### #/components/schemas/products

```ts
{
  // Id of the product
  id?: integer
  // SIIS product code
  code?: string
  // product label
  label?: string
  // product attribution
  attribution?: string
  // Array of WxS types available
  formats?: string[]
  // GeoServer layer style
  style?: string
  // GeoServer delivery SRS
  srss?: integer[]
  // Geoserver layer name
  gs_layername?: string
  // Geoserver WMS endpoint - temporary for testing
  gs_wmsendpoint?: string
  // Geoserver WFS endpoint - temporary for testing
  gs_wfsendpoint?: string
  // Geoserver WMTS endpoint - temporary for testing
  gs_wmtsendpoint?: string
  // Array of WxS types available
  types?: string[]
  // Array of timestamps available
  timestamps?: string
  // Does product has legend
  haslegend?: string
  // Hemisphere of product ('N'/'S'/'')
  hemisphere?: string
  // Static background product/layer without granules?
  static?: boolean
  // Default time filter in hours applied on granules for app rendering
  default_timeframe?: integer
  // Status of product feed, based on status of granules
  status?: enum[offline, online, loading, static, outdated, error]
  // Whether overlapping rendering of multiple active granules is allowed or exclusive render of one granule is required
  render_exclusive?: boolean
  // Indicated availability of a corresponding high-resolution granule
  highres_available?: boolean
  // Holds GeoServer WMS request parameters for legend graphic styling
  legend_graphic_params?: string
  // Show product in product list by default
  show_on_startup?: boolean
  // Default render opacity
  default_opacity?: number
  // Default z-index / layer stacking order for map rendering
  default_z?: integer
  // product footprint
  geom_extent?: string
}[]
```

### #/components/schemas/granule

```ts
{
  // Granule UUID
  id?: integer
  // SIIS product code
  productcode?: string
  // Timestamp of granule
  timestamp?: string
  // Downloadable
  downloadable?: integer
  // Downloaded to local
  downloaded?: string
  // Filename of product for download package
  filename_dl?: string
  // Download file size
  size_dl?: integer
  // Zipped product for download
  zipped?: integer
  // Filename of product after extraction
  productname?: string
  // Timestamp of ingestion into shore-side catalogue
  ts_catingest?: string
  // Timestamp of download request to shore-side
  ts_dlrequest?: string
  // Timestamp of finished download ship-side
  ts_downloaded?: string
  // Timestamp of successful ship-side GeoServer ingest
  ts_gsingest?: string
  // Status of granule availability on vessel
  status?: enum[offline, online, loading, static, outdated, error, hr_requested, hr_pending, hr_processing, hr_online]
  // product footprint
  geom_extent?: string
  // product footprint in GeoJSON format (MultiPolygon)
  geojson_extent: {
    type?: enum[MultiPolygon]
    coordinates?: number[][][][]
  }
}
```

### #/components/schemas/granules

```ts
{
  // Granule UUID
  id?: integer
  // SIIS product code
  productcode?: string
  // Timestamp of granule
  timestamp?: string
  // Downloadable
  downloadable?: integer
  // Downloaded to local
  downloaded?: string
  // Filename of product for download package
  filename_dl?: string
  // Download file size
  size_dl?: integer
  // Zipped product for download
  zipped?: integer
  // Filename of product after extraction
  productname?: string
  // Timestamp of ingestion into shore-side catalogue
  ts_catingest?: string
  // Timestamp of download request to shore-side
  ts_dlrequest?: string
  // Timestamp of finished download ship-side
  ts_downloaded?: string
  // Timestamp of successful ship-side GeoServer ingest
  ts_gsingest?: string
  // Status of granule availability on vessel
  status?: enum[offline, online, loading, static, outdated, error, hr_requested, hr_pending, hr_processing, hr_online]
  // product footprint
  geom_extent?: string
  // product footprint in GeoJSON format (MultiPolygon)
  geojson_extent: {
    type?: enum[MultiPolygon]
    coordinates?: number[][][][]
  }
}[]
```

### #/components/schemas/kv

```ts
{
  // Key identifier of KV pair
  key?: string
  // Value of KV pair
  value?: string
}
```

### #/components/schemas/kvs

```ts
{
  // Key identifier of KV pair
  key?: string
  // Value of KV pair
  value?: string
}[]
```