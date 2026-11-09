import { calculateBackendRisk } from './riskController.js';

let inMemoryShipments = [
  {
    id: 101,
    shipmentCode: 'RS-9421',
    origin: 'New York, NY',
    destination: 'Chicago, IL',
    transportMode: 'truck',
    cargoCategory: 'perishable',
    cargoWeight: 6200,
    distance: 1280,
    weatherCondition: 'storm',
    carrierRating: 'C',
    trafficCongestion: 75,
    timestamp: new Date().toISOString()
  },
  {
    id: 102,
    shipmentCode: 'RS-5510',
    origin: 'Los Angeles, CA',
    destination: 'Dallas, TX',
    transportMode: 'air',
    cargoCategory: 'electronics',
    cargoWeight: 1400,
    distance: 2300,
    weatherCondition: 'clear',
    carrierRating: 'A+',
    trafficCongestion: 20,
    timestamp: new Date().toISOString()
  },
  {
    id: 103,
    shipmentCode: 'RS-3382',
    origin: 'Seattle, WA',
    destination: 'Denver, CO',
    transportMode: 'rail',
    cargoCategory: 'heavy',
    cargoWeight: 18500,
    distance: 2100,
    weatherCondition: 'snow',
    carrierRating: 'B',
    trafficCongestion: 40,
    timestamp: new Date().toISOString()
  }
].map(s => ({ ...s, riskAnalysis: calculateBackendRisk(s) }));

export const getShipments = (req, res) => {
  res.json({
    success: true,
    count: inMemoryShipments.length,
    data: inMemoryShipments
  });
};

export const getShipmentById = (req, res) => {
  const id = Number(req.params.id);
  const shipment = inMemoryShipments.find(s => s.id === id);

  if (!shipment) {
    return res.status(404).json({
      success: false,
      message: `Shipment with ID ${id} not found.`
    });
  }

  res.json({
    success: true,
    data: shipment
  });
};

export const createShipment = (req, res) => {
  const newShipment = {
    id: Date.now(),
    shipmentCode: req.body.shipmentCode || ('RS-' + Math.floor(1000 + Math.random() * 9000)),
    origin: req.body.origin,
    destination: req.body.destination,
    transportMode: req.body.transportMode || 'truck',
    cargoCategory: req.body.cargoCategory || 'standard',
    cargoWeight: Number(req.body.cargoWeight) || 2500,
    distance: Number(req.body.distance) || 500,
    weatherCondition: req.body.weatherCondition || 'clear',
    carrierRating: req.body.carrierRating || 'A',
    trafficCongestion: Number(req.body.trafficCongestion) || 30,
    timestamp: new Date().toISOString()
  };

  newShipment.riskAnalysis = calculateBackendRisk(newShipment);
  inMemoryShipments.unshift(newShipment);

  res.status(201).json({
    success: true,
    message: 'Shipment created and risk calculated successfully.',
    data: newShipment
  });
};

export const deleteShipment = (req, res) => {
  const id = Number(req.params.id);
  const initialLength = inMemoryShipments.length;
  inMemoryShipments = inMemoryShipments.filter(s => s.id !== id);

  if (inMemoryShipments.length === initialLength) {
    return res.status(404).json({
      success: false,
      message: `Shipment with ID ${id} not found.`
    });
  }

  res.json({
    success: true,
    message: `Shipment ${id} deleted successfully.`
  });
};
