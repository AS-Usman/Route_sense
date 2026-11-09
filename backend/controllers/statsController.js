export const getHealthStatus = (req, res) => {
  res.json({
    success: true,
    status: 'online',
    service: 'RouteSense Node.js REST API',
    version: '1.0.0',
    uptimeSeconds: process.uptime(),
    timestamp: new Date().toISOString()
  });
};

export const getDashboardStats = (req, res) => {
  res.json({
    success: true,
    data: {
      deliveries: { total: 1280, change: '+8.4% vs last week' },
      onTimeScore: { percentage: 94.8, change: '+4.2% quality gain' },
      activeRoutes: { count: 312, change: '+14 routes added' },
      riskExposure: { rate: '23.4%', criticalAlerts: 8 },
      fleetReadiness: { percentage: '89.5%', activeVehicles: 48 },
      weatherDisruption: { rate: '11.8%', stormWarnings: 2 }
    }
  });
};
