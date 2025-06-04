function inferInputFromOutput(layout) {
  const { boundaries, rooms } = layout;
  const { width, height } = boundaries;

  let master_rooms = 0;
  let unattached_bathrooms = 0;
  let cars = 0;
  let bikes = 0;

  // Count master bedrooms (they're named "Master Bedroom X" in allocateRooms)
  master_rooms = rooms.filter(r => 
    r.name.toLowerCase().startsWith("master bedroom")
  ).length;

  // Count total bathrooms and separate attached vs unattached
  const allBathrooms = rooms.filter(r =>
    r.name.toLowerCase().includes("bathroom") || 
    r.name.toLowerCase().includes("toilet")
  );
  
  // Attached bathrooms are those named with "Master Bathroom" or "Guest Bathroom"
  const attachedBathrooms = allBathrooms.filter(r =>
    r.name.toLowerCase().includes("master bathroom") ||
    r.name.toLowerCase().includes("guest bathroom")
  ).length;
  
  // Unattached bathrooms are the rest (including "Common Toilet")
  unattached_bathrooms = allBathrooms.length - attachedBathrooms;

  // Estimate cars and bikes from Parking dimensions
  const parking = rooms.find(r => r.name.toLowerCase() === "parking");
  if (parking) {
    const parkingWidth = parking.x2 - parking.x1;
    const parkingHeight = parking.y2 - parking.y1;

    // Standard dimensions from allocateRooms
    const CAR_WIDTH = 14;
    const CAR_HEIGHT = 6;
    const BIKE_WIDTH = 8;
    const BIKE_HEIGHT = 3;

    // Calculate possible combinations
    const maxCars = Math.min(
      Math.floor(parkingWidth / CAR_WIDTH),
      Math.floor(parkingHeight / CAR_HEIGHT)
    );
    const maxBikes = Math.min(
      Math.floor(parkingWidth / BIKE_WIDTH),
      Math.floor(parkingHeight / BIKE_HEIGHT)
    );

    // Find the combination that best fits the parking area
    let bestFit = { cars: 0, bikes: 0, areaUsed: 0 };
    for (let c = 0; c <= maxCars; c++) {
      for (let b = 0; b <= maxBikes; b++) {
        const requiredWidth = Math.max(c * CAR_WIDTH, b * BIKE_WIDTH);
        const requiredHeight = Math.max(
          c > 0 ? CAR_HEIGHT : 0,
          b > 0 ? BIKE_HEIGHT : 0
        );
        
        if (requiredWidth <= parkingWidth && requiredHeight <= parkingHeight) {
          const areaUsed = requiredWidth * requiredHeight;
          if (areaUsed > bestFit.areaUsed) {
            bestFit = { cars: c, bikes: b, areaUsed };
          }
        }
      }
    }

    cars = bestFit.cars;
    bikes = bestFit.bikes;
  }

  return {
    width,
    height,
    master_rooms,
    bathrooms: unattached_bathrooms ,
    cars,
    bikes
  };
}

module.exports = inferInputFromOutput;