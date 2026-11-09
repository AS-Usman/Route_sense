export const validateShipmentPayload = (req, res, next) => {
  const { origin, destination, distance, cargoWeight, transportMode } = req.body;
  const errors = [];

  if (!origin || typeof origin !== 'string' || !origin.trim()) {
    errors.push('Origin location is required and must be text.');
  }

  if (!destination || typeof destination !== 'string' || !destination.trim()) {
    errors.push('Destination location is required and must be text.');
  }

  if (distance === undefined || isNaN(Number(distance)) || Number(distance) <= 0) {
    errors.push('Distance must be a positive number greater than 0.');
  }

  if (cargoWeight !== undefined && (isNaN(Number(cargoWeight)) || Number(cargoWeight) <= 0)) {
    errors.push('Cargo weight must be a positive number.');
  }

  if (transportMode && !['truck', 'air', 'rail', 'maritime'].includes(transportMode)) {
    errors.push('Transport mode must be one of: truck, air, rail, maritime.');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation Failed',
      errors
    });
  }

  next();
};
