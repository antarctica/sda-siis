import {padNumber} from 'ol/string.js';
import {modulo} from 'ol/math.js';

export const decimalMinutes = function(decimalDegrees, opt_fractionDigits) {
  const degrees = decimalDegrees | 0;
  const decimalMinutes = Math.abs((decimalDegrees - degrees)*60)
  return padNumber(decimalMinutes, 2, opt_fractionDigits);
};

export const degreesToStringHDDM = function(hemispheres, degrees, opt_fractionDigits) {
  const normalizedDegrees = modulo(degrees + 180, 360) - 180;
  const x = Math.abs(3600 * normalizedDegrees);
  const dflPrecision = opt_fractionDigits || 0;
  const precision = Math.pow(10, dflPrecision);
  let deg = Math.floor(x / 3600);
  let min = Math.floor((x - deg * 3600) / 60);
  let sec = x - deg * 3600 - min * 60;
  sec = Math.ceil(sec * precision) / precision;

  if (sec >= 60) {
    sec = 0;
    min += 1;
  }
  if (min >= 60) {
    min = 0;
    deg += 1;
  }

  return (
    deg +
    '\u00b0' +
    decimalMinutes(degrees, dflPrecision) +
    '\u2032' +
    (normalizedDegrees == 0 ? '' : '' + hemispheres.charAt(normalizedDegrees < 0 ? 1 : 0))
  );
};
