import { SpatialReference } from '@arcgis/core/geometry';
import * as coordinateFormatter from '@arcgis/core/geometry/coordinateFormatter';
import { project } from '@arcgis/core/geometry/projection';
import { SimpleMarkerSymbol } from '@arcgis/core/symbols';
import { css, cx } from '@styled-system/css';
import { Divider, Flex } from '@styled-system/jsx';
import React from 'react';
import {
  composeRenderProps,
  DialogTrigger,
  Input,
  TextField as AriaTextField,
  TextFieldProps as AriaTextFieldProps,
  ValidationResult,
} from 'react-aria-components';
import { useListData } from 'react-stately';

import { SelectionMenu } from '@/components/common/SelectionMenu';
import {
  DrawSingleGraphicOptions,
  useDrawSingleGraphic,
} from '@/features/arcgis/hooks/useDrawSingleGraphic';
import { detectCoordinateFormat, DisplayFormat, formatCoordinate } from '@/utils/formatCoordinates';

import { IconButton } from '../../Button';
import SvgIcon from '../../SvgIcon';
import { Description, FieldError, FieldGroup, Label } from '../Field';
import { fieldRecipe, inputContainerRecipe, inputRecipe } from '../Field/styles';

const COORDINATE_FORMATS: DisplayFormat[] = ['DMS', 'DD', 'DDM'];

const ICON_SIZES = {
  LOCATION: 20,
  CHEVRON: 14,
} as const;

const DEFAULT_COORDINATES = {
  latitude: 0,
  longitude: 0,
};

const DEFAULT_DISPLAY_FORMAT = 'DMS';

const DEFAULT_POINT_SYMBOL = new SimpleMarkerSymbol({
  color: [0, 0, 0, 0],
  size: 10,
  outline: {
    color: [0, 0, 0, 0],
    width: 1,
  },
});

export interface CoordinateInputMapSelectionOptions {
  mapSelectionEnabled: boolean;
  mapView?: __esri.MapView;
  pointSymbol?: __esri.SimpleMarkerSymbol;
  updateEnabled?: boolean;
  graphicsLayer?: __esri.GraphicsLayer;
}

interface BaseCoordinateInputProps extends Omit<AriaTextFieldProps, 'value' | 'onChange'> {
  label?: string;
  defaultDisplayFormat?: DisplayFormat;
  placeholder?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
  mapSelectionOptions: CoordinateInputMapSelectionOptions;
}

interface ControlledCoordinateInputProps extends BaseCoordinateInputProps {
  value: string;
  onChange: (value: string) => void;
  defaultValue?: never;
}

interface UncontrolledCoordinateInputProps extends BaseCoordinateInputProps {
  defaultValue?: string;
  value?: never;
  onChange?: never;
}

type CoordinateInputProps = ControlledCoordinateInputProps | UncontrolledCoordinateInputProps;

export function CoordinateField({
  label,
  placeholder,
  value,
  defaultValue,
  onChange,
  description,
  errorMessage,
  isRequired,
  validate,
  mapSelectionOptions,
  ...props
}: CoordinateInputProps) {
  const [displayFormat, setDisplayFormat] = React.useState<DisplayFormat | 'unknown'>(() => {
    if (value) return detectCoordinateFormat(value);
    if (defaultValue) return detectCoordinateFormat(defaultValue);
    return 'unknown';
  });

  const [coordinate, setCoordinate] = React.useState<__esri.Point | null>(() => {
    if (value) return coordinateFormatter.fromLatitudeLongitude(value);
    if (defaultValue) return coordinateFormatter.fromLatitudeLongitude(defaultValue);
    return null;
  });

  const validateCoordinate = React.useCallback(
    (value: string | undefined, isRequired?: boolean, customValidate?: typeof validate) => {
      if (customValidate) return customValidate(value ?? '');
      if (!value && isRequired) return 'Required';
      if (!value) return false;
      return coordinateFormatter.fromLatitudeLongitude(value) ? false : 'Invalid coordinate';
    },
    [],
  );

  const errors = React.useMemo(
    () => validateCoordinate(value, isRequired, validate),
    [validateCoordinate, value, isRequired, validate],
  );

  const handleInputChange = React.useCallback(
    (newValue: string) => {
      const parsedPoint = coordinateFormatter.fromLatitudeLongitude(newValue);
      const format = detectCoordinateFormat(newValue);
      setDisplayFormat(format);

      onChange?.(newValue);

      if (parsedPoint) {
        setCoordinate(parsedPoint);
      }
    },
    [onChange],
  );

  return (
    <AriaTextField
      {...props}
      isRequired={isRequired}
      isInvalid={!!errors}
      className={composeRenderProps(props.className, (className) => cx(fieldRecipe(), className))}
    >
      {(props) => (
        <>
          {label && <Label>{label}</Label>}
          <FieldGroup
            isInvalid={props.isInvalid}
            isDisabled={props.isDisabled}
            className={cx(inputContainerRecipe())}
          >
            <Flex direction="row" align="center" grow={1} gap="1" flexDirection={'row'}>
              {mapSelectionOptions.mapSelectionEnabled && mapSelectionOptions.mapView && (
                <Flex align="center" grow={0}>
                  <CoordinateMapSelection
                    coordinate={coordinate}
                    updateEnabled={mapSelectionOptions?.updateEnabled}
                    mapView={mapSelectionOptions?.mapView}
                    pointSymbol={mapSelectionOptions?.pointSymbol}
                    graphicsLayer={mapSelectionOptions?.graphicsLayer}
                    handleMapCoordinateSelection={handleInputChange}
                    format={displayFormat}
                  />

                  <Divider orientation="vertical" h={'9'} color="bg.base.border" />
                </Flex>
              )}
              <Input
                value={value ?? ''}
                className={composeRenderProps('', (className, renderProps) =>
                  cx(inputRecipe(renderProps), css({ flexGrow: 1 }), className),
                )}
                placeholder={placeholder}
                onChange={(e) => handleInputChange(e.target.value)}
              />
            </Flex>
            <Flex align="center" grow={0} h="full">
              <Divider orientation="vertical" h={'9'} color="bg.base.border" />
              <CoordinateSelectionMenu
                key={`${coordinate?.latitude}-${coordinate?.longitude}-${displayFormat}`}
                coordinate={coordinate}
                currentDisplayFormat={displayFormat}
                setValue={handleInputChange}
              />
            </Flex>
          </FieldGroup>
          {description && <Description>{description}</Description>}
          <FieldError>{errorMessage ?? errors}</FieldError>
        </>
      )}
    </AriaTextField>
  );
}

function CoordinateSelectionMenu({
  coordinate,
  currentDisplayFormat,
  setValue,
}: {
  coordinate: __esri.Point | null;
  currentDisplayFormat: DisplayFormat | 'unknown';
  setValue: (value: string) => void;
}) {
  const items = React.useMemo(
    () =>
      COORDINATE_FORMATS.map((format) => {
        const formattedCoordinate = formatCoordinate(
          coordinate?.latitude ?? DEFAULT_COORDINATES.latitude,
          coordinate?.longitude ?? DEFAULT_COORDINATES.longitude,
          format,
        );
        return {
          label: `${format} (${formattedCoordinate})`,
          value: formattedCoordinate,
          id: format,
        };
      }),
    [coordinate],
  );

  const listData = useListData({
    initialItems: items,
    initialSelectedKeys: [currentDisplayFormat],
    getKey: (item) => item.id,
    filter: (item, filterText) => item.value !== filterText,
    initialFilterText: currentDisplayFormat,
  });

  return (
    <SelectionMenu
      className={css({ w: '80' })}
      listData={listData}
      onSelect={(value) => {
        setValue(value ?? '');
      }}
      trigger={
        <DialogTrigger>
          <IconButton
            icon={<SvgIcon name="icon-up-down-chevron" size={ICON_SIZES.CHEVRON} />}
            aria-label="Select coordinate format"
            variant="surface"
            contained
            size="sm"
          />
        </DialogTrigger>
      }
    ></SelectionMenu>
  );
}

function CoordinateMapSelection({
  mapView,
  coordinate,
  handleMapCoordinateSelection,
  format,
  updateEnabled,
  pointSymbol,
  graphicsLayer,
}: {
  mapView: __esri.MapView;
  coordinate: __esri.Point | null;
  handleMapCoordinateSelection: (value: string) => void;
  format: DisplayFormat | 'unknown';
  updateEnabled?: boolean;
  pointSymbol?: __esri.SimpleMarkerSymbol;
  graphicsLayer?: __esri.GraphicsLayer;
}) {
  const updateCoordinate = React.useCallback(
    (graphic: __esri.Graphic | undefined) => {
      if (!graphic) {
        handleMapCoordinateSelection('');
        return;
      }
      const point = graphic.geometry as __esri.Point;
      const collectionFormat = format !== 'unknown' ? format : DEFAULT_DISPLAY_FORMAT;
      const projectedPoint = project(point, SpatialReference.WGS84) as __esri.Point;
      const value = formatCoordinate(
        projectedPoint.latitude,
        projectedPoint.longitude,
        collectionFormat,
      );
      handleMapCoordinateSelection(value ?? '');
    },
    [handleMapCoordinateSelection, format],
  );

  const options: DrawSingleGraphicOptions = React.useMemo(
    () => ({
      onCreateGraphic: updateCoordinate,
      onUpdateGraphic: updateCoordinate,
      onDeleteGraphic: () => handleMapCoordinateSelection(''),
      sketchOptions: { pointSymbol: pointSymbol ?? DEFAULT_POINT_SYMBOL },
      updateEnabled: updateEnabled ?? false,
      graphicsLayer,
    }),
    [updateCoordinate, handleMapCoordinateSelection, updateEnabled, pointSymbol, graphicsLayer],
  );

  const { create, activeDrawMode, graphic } = useDrawSingleGraphic(
    mapView,
    'coordinate-map-selection',
    options,
  );

  React.useEffect(() => {
    if (graphic && coordinate) {
      const projectedCoordinate = project(coordinate, mapView.spatialReference) as __esri.Point;
      graphic.geometry = projectedCoordinate;
    }
  }, [graphic, coordinate, mapView.spatialReference]);

  return (
    <IconButton
      icon={<SvgIcon name="icon-map-location" size={ICON_SIZES.LOCATION} />}
      onPress={() => create('point')}
      aria-label="Select map location"
      contained
      variant={activeDrawMode === 'point' ? 'primary' : 'surface'}
    />
  );
}

export default CoordinateField;
