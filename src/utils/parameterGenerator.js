function inferInputFromOutput(layout) {
  const { boundaries, rooms } = layout;
  const { width, height } = boundaries;

  let master_rooms = 0;
  let bathrooms = 0;
  let cars = 0;
  let bikes = 0;

  // Count master rooms
  master_rooms = rooms.filter(r => r.name.startsWith("Master Room")).length;

  // Count bathrooms, toilets, and attached bathrooms
  bathrooms = rooms.filter(r =>
    r.name.toLowerCase().includes("bathroom") || r.name.toLowerCase().includes("toilet")
  ).length;

  // Estimate cars and bikes from Parking dimensions
  const parking = rooms.find(r => r.name.toLowerCase() === "parking");
  if (parking) {
    const parkingWidth = parking.x2 - parking.x1;

    // Try to estimate vehicles based on known sizes
    const CAR_WIDTH = 14;
    const BIKE_WIDTH = 8;
    const maxParkingWidth = width / 2;

    // Cars take more space, so prioritize cars in reverse calculation
    for (let c = 0; c <= Math.floor(parkingWidth / CAR_WIDTH); c++) {
      for (let b = 0; b <= Math.floor(parkingWidth / BIKE_WIDTH); b++) {
        const usedWidth = Math.max(c * CAR_WIDTH, b * BIKE_WIDTH);
        if (usedWidth.toFixed(2) === parkingWidth.toFixed(2)) {
          cars = c;
          bikes = b;
          break;
        }
      }
      if (cars || bikes) break;
    }
  }

  return {
    width,
    height,
    master_rooms,
    bathrooms,
    cars,
    bikes
  };
}

module.exports = inferInputFromOutput;