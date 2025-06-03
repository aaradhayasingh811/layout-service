class Room {
  constructor(name, x1, y1, x2, y2) {
    this.name = name;
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
  }
}

function calculateArea(x1, y1, x2, y2) {
  return Math.abs((x2 - x1) * (y2 - y1));
}

function allocateRooms(width, height, master_rooms, unattached_bathrooms, cars, bikes) {
  const rooms = [];
  const MIN_ROOM_SIZE = 8;
  const MIN_BATHROOM_SIZE = 6;
  const MIN_KITCHEN_SIZE = 10;
  const MIN_STAIR_AREA = 12;
  const MIN_DINING_AREA = 15;
  const MIN_DECORATIVE_AREA = 10;
  const MIN_ENTRANCE_AREA = 10;
  
  // Standard dimensions
  const CAR_WIDTH = 14;
  const CAR_HEIGHT = 6;
  const BIKE_WIDTH = 8;
  const BIKE_HEIGHT = 3;
  const CORRIDOR_WIDTH = 4;

  // Calculate parking area
  const parkingWidth = Math.min(
    Math.max(cars * CAR_WIDTH, bikes * BIKE_WIDTH),
    width * 0.5
  );
  const parkingHeight = Math.max(CAR_HEIGHT, BIKE_HEIGHT);
  
  // Add parking area (right side)
  const parkingX1 = width - parkingWidth;
  const parking = new Room("Parking", parkingX1, 0, width, parkingHeight);
  rooms.push(parking);
  let remainingHeight = height - parkingHeight;
  
  // Add corridor (vertical) - left side of parking
  const corridorX2 = parkingX1;
  const corridorX1 = corridorX2 - CORRIDOR_WIDTH;
  const corridor = new Room("Corridor", corridorX1, parkingHeight, corridorX2, height);
  rooms.push(corridor);
  
  // Entrance Gate - the space between decorative area and parking (in front of corridor)
  const entranceGate = new Room("Entrance Gate", corridorX1, 0, corridorX2, parkingHeight);
  rooms.push(entranceGate);
  
  // Decorative area is now on the left side (left of entrance gate)
  const decorativeWidth = corridorX1;
  if (parkingHeight > 0 && decorativeWidth > 0) {
    // Split decorative area into entrance and decorative sections
    const entranceHeight = Math.min(parkingHeight * 0.4, Math.sqrt(MIN_ENTRANCE_AREA) * 2);
    
    if (entranceHeight >= Math.sqrt(MIN_ENTRANCE_AREA)) {
      rooms.push(new Room("Entrance/Foyer", 0, 0, decorativeWidth, entranceHeight));
      
      // Remaining space for decorative area
      const decorativeHeight = parkingHeight - entranceHeight;
      if (decorativeHeight >= Math.sqrt(MIN_DECORATIVE_AREA)) {
        rooms.push(new Room("Decorative Area", 
          0, entranceHeight, 
          decorativeWidth, parkingHeight));
      }
    } else {
      // If not enough for entrance, just make decorative area
      rooms.push(new Room("Decorative Area", 0, 0, decorativeWidth, parkingHeight));
    }
  }

  // Calculate available areas
  const leftWidth = corridorX1; // Decorative/entrance side
  const rightWidth = width - corridorX2; // Parking side

  // Left side allocation (private/master areas)
  let currentYLeft = parkingHeight;
  
  // Master bedrooms with attached bathrooms
  for (let i = 0; i < master_rooms; i++) {
    if (currentYLeft + MIN_ROOM_SIZE > height) break;
    
    const masterHeight = Math.min(
      height * 0.3,
      Math.max(
        Math.sqrt(MIN_BATHROOM_SIZE) * 2,
        (remainingHeight * 0.7) / master_rooms
      )
    );
    const y1 = currentYLeft;
    const y2 = Math.min(y1 + masterHeight, height);
    
    // Master bedroom takes full width, bathroom is part of it
    rooms.push(new Room(`Master Bedroom ${i + 1}`, 0, y1, leftWidth, y2));
    
    // Attached bathroom
    const bathroomWidth = leftWidth * 0.3;
    const bathroomHeight = Math.min(y2 - y1, bathroomWidth * 1.2);
    rooms.push(new Room(`Master Bathroom ${i + 1}`, 
      leftWidth - bathroomWidth, y2 - bathroomHeight, 
      leftWidth, y2));
    
    currentYLeft = y2;
  }

  // Kitchen (left side)
  const kitchenHeight = Math.min(remainingHeight * 0.2, leftWidth * 0.8);
  if (currentYLeft + MIN_KITCHEN_SIZE <= height) {
    rooms.push(new Room("Kitchen", 0, currentYLeft, leftWidth, currentYLeft + kitchenHeight));
    currentYLeft += kitchenHeight;
  }

  // Utility/Storage (left side)
  if (currentYLeft + MIN_ROOM_SIZE <= height * 0.8) {
    const utilityHeight = Math.min(height - currentYLeft - MIN_STAIR_AREA, height * 0.15);
    rooms.push(new Room("Utility/Storage", 0, currentYLeft, leftWidth, currentYLeft + utilityHeight));
    currentYLeft += utilityHeight;
  }

  // Right side allocation (public/guest areas)
  let currentYRight = parkingHeight;
  
  // Guest rooms with attached bathrooms
  const guestRoomCount = Math.min(3, Math.max(1, master_rooms - 1));
  
  if (guestRoomCount > 0) {
    const totalGuestHeight = remainingHeight * 0.6;
    const minGuestHeight = Math.sqrt(MIN_BATHROOM_SIZE) * 2;
    const guestHeight = Math.max(minGuestHeight, totalGuestHeight / guestRoomCount);
    
    for (let i = 0; i < guestRoomCount; i++) {
      if (currentYRight + MIN_ROOM_SIZE > height) break;
      
      const y1 = currentYRight;
      const y2 = Math.min(y1 + guestHeight, height);
      
      // Guest room takes full width (from corridor to parking)
      rooms.push(new Room(`Guest Room ${i + 1}`, corridorX2, y1, width, y2));
      
      // Attached bathroom
      const bathroomWidth = (width - corridorX2) * 0.3;
      const bathroomHeight = Math.min(y2 - y1, bathroomWidth * 1.2);
      rooms.push(new Room(`Guest Bathroom ${i + 1}`, 
        width - bathroomWidth, y2 - bathroomHeight, 
        width, y2));
      
      currentYRight = y2;
    }
  }

  // Calculate remaining space for unattached bathrooms
  const remainingRightHeight = height - currentYRight;
  const remainingRightArea = (width - corridorX2) * remainingRightHeight;
  
  // Allocate unattached bathrooms more efficiently
  if (unattached_bathrooms > 0 && remainingRightArea >= MIN_BATHROOM_SIZE) {
    // Calculate total bathroom area needed
    const totalBathroomArea = unattached_bathrooms * MIN_BATHROOM_SIZE;
    
    if (remainingRightArea >= totalBathroomArea) {
      // We have enough space - distribute evenly
      const bathroomHeight = remainingRightHeight / unattached_bathrooms;
      
      for (let i = 0; i < unattached_bathrooms; i++) {
        const y1 = currentYRight + i * bathroomHeight;
        const y2 = y1 + bathroomHeight;
        
        rooms.push(new Room(
          i === unattached_bathrooms - 1 ? "Common Toilet" : `Bathroom ${i + 1}`,
          corridorX2, y1, width, y2
        ));
      }
      currentYRight = height;
    } else {
      // Not enough space - try to fit as many as possible
      const possibleBathrooms = Math.floor(remainingRightArea / MIN_BATHROOM_SIZE);
      if (possibleBathrooms > 0) {
        const bathroomHeight = remainingRightHeight / possibleBathrooms;
        
        for (let i = 0; i < possibleBathrooms; i++) {
          const y1 = currentYRight + i * bathroomHeight;
          const y2 = y1 + bathroomHeight;
          
          rooms.push(new Room(
            i === possibleBathrooms - 1 ? "Common Toilet" : `Bathroom ${i + 1}`,
            corridorX2, y1, width, y2
          ));
        }
        currentYRight = height;
      }
    }
  }

  // If there's any remaining space on the right side, use it for living/dining
  if (currentYRight < height) {
    const remainingSpace = height - currentYRight;
    if (remainingSpace >= Math.sqrt(MIN_DINING_AREA)) {
      // Split into living and dining if enough space
      const livingHeight = remainingSpace * 0.6;
      const diningHeight = remainingSpace - livingHeight;
      
      if (diningHeight >= Math.sqrt(MIN_DINING_AREA)) {
        rooms.push(new Room("Living Area", corridorX2, currentYRight, width, currentYRight + livingHeight));
        rooms.push(new Room("Dining Area", corridorX2, currentYRight + livingHeight, width, height));
      } else {
        rooms.push(new Room("Living/Dining", corridorX2, currentYRight, width, height));
      }
    } else {
      rooms.push(new Room("Utility Space", corridorX2, currentYRight, width, height));
    }
  }

  // Staircase (left side if space remains)
  if (currentYLeft < height) {
    const remainingLeftHeight = height - currentYLeft;
    if (remainingLeftHeight >= Math.sqrt(MIN_STAIR_AREA)) {
      rooms.push(new Room("Staircase", 0, currentYLeft, leftWidth, height));
    } else {
      // If not enough for staircase, merge with last room
      const lastLeftRoom = rooms.find(r => r.y2 === currentYLeft && r.x2 === leftWidth);
      if (lastLeftRoom) {
        lastLeftRoom.y2 = height;
      } else {
        rooms.push(new Room("Utility Space", 0, currentYLeft, leftWidth, height));
      }
    }
  }

  // Validate all rooms meet minimum size requirements
  const validRooms = rooms.filter(room => {
    const area = calculateArea(room.x1, room.y1, room.x2, room.y2);
    const minSize = room.name.includes("Bathroom") ? MIN_BATHROOM_SIZE : 
                   room.name.includes("Kitchen") ? MIN_KITCHEN_SIZE :
                   room.name === "Staircase" ? MIN_STAIR_AREA :
                   room.name.includes("Dining") ? MIN_DINING_AREA :
                   room.name.includes("Decorative") ? MIN_DECORATIVE_AREA :
                   room.name.includes("Entrance") ? MIN_ENTRANCE_AREA : MIN_ROOM_SIZE;
    return area >= minSize;
  });

  return {
    boundaries: { width, height },
    rooms: validRooms.map((r) => ({
      name: r.name,
      x1: +r.x1.toFixed(2),
      y1: +r.y1.toFixed(2),
      x2: +r.x2.toFixed(2),
      y2: +r.y2.toFixed(2),
      area: +calculateArea(r.x1, r.y1, r.x2, r.y2).toFixed(2),
    })),
  };
}

module.exports = allocateRooms;