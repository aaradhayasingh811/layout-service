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

function allocateRooms(width, height, master_rooms, bathrooms, cars, bikes) {
  const rooms = [];
  let remainingHeight = height;

  const CAR_WIDTH = 14;
  const CAR_HEIGHT = 6;
  const BIKE_WIDTH = 8;
  const BIKE_HEIGHT = 3;
  const CORRIDOR_WIDTH = 4;
  const MIN_ROOM_SIZE = 8;

  // let parkingWidth = Math.max(cars * CAR_WIDTH, bikes * BIKE_WIDTH);
  // let parkingHeight = Math.max(CAR_HEIGHT, BIKE_HEIGHT);
  // if (parkingWidth > width) parkingWidth = width;
  let parkingWidth = Math.max(cars * CAR_WIDTH, bikes * BIKE_WIDTH);
let parkingHeight = Math.max(CAR_HEIGHT, BIKE_HEIGHT);

// Cap parking width to half the available width
const maxParkingWidth = width / 2;
parkingWidth = Math.min(parkingWidth, maxParkingWidth);


  const parking = new Room("Parking", 0, 0, parkingWidth, parkingHeight);
  rooms.push(parking);
  remainingHeight -= parkingHeight;

  const corridor = new Room("Corridor", parkingWidth, parkingHeight, parkingWidth + CORRIDOR_WIDTH, height);
  rooms.push(corridor);

  const leftWidth = parkingWidth;
  const rightWidth = width - parkingWidth - CORRIDOR_WIDTH;

  const leftArea = leftWidth * remainingHeight;
  const rightArea = rightWidth * remainingHeight;

  const totalGuestArea = leftArea * 0.5;
  const totalMasterArea = rightArea * 0.7;

  const guestRoomCount = Math.min(3, Math.max(1, master_rooms));
  const guestRoomArea = totalGuestArea / guestRoomCount;
  const guestRoomHeight = guestRoomArea / leftWidth;

  let currentY = parkingHeight;
  for (let i = 0; i < guestRoomCount; i++) {
    const y1 = currentY;
    const y2 = y1 + guestRoomHeight;
    rooms.push(new Room(`Guest Room ${i + 1}`, 0, y1, leftWidth, y2));
    currentY = y2;
  }

  const bathroomCount = Math.min(bathrooms, 2);
  const bathroomHeight = remainingHeight * 0.15;
  for (let i = 0; i < bathroomCount; i++) {
    const bathroomWidth = leftWidth / bathroomCount;
    const name = i < bathroomCount - 1 ? `Bathroom ${i + 1}` : "Toilet";
    rooms.push(new Room(name, i * bathroomWidth, currentY, (i + 1) * bathroomWidth, currentY + bathroomHeight));
  }
  currentY += bathroomHeight;

  if (currentY < height - MIN_ROOM_SIZE) {
    rooms.push(new Room("Dining + Gardening", 0, currentY, leftWidth, height));
  }

  const masterRoomArea = totalMasterArea / master_rooms;
  const masterRoomHeight = masterRoomArea / rightWidth;

  let currentYRight = parkingHeight;
  for (let i = 0; i < master_rooms; i++) {
    const y1 = currentYRight;
    const y2 = y1 + masterRoomHeight;
    rooms.push(new Room(`Master Room ${i + 1}`, parkingWidth + CORRIDOR_WIDTH, y1, width, y2));

    if (i === 0 && bathrooms > 0) {
      const bathWidth = rightWidth * 0.3;
      rooms.push(new Room("Attached Bathroom", width - bathWidth, y1, width, y2));
    }

    currentYRight = y2;
  }

  const kitchenHeight = remainingHeight * 0.2;
  rooms.push(new Room("Kitchen", parkingWidth + CORRIDOR_WIDTH, currentYRight, width, currentYRight + kitchenHeight));
  currentYRight += kitchenHeight;

  // if (currentYRight < height - MIN_ROOM_SIZE) {
  //   rooms.push(new Room("Staircase", parkingWidth + CORRIDOR_WIDTH, currentYRight, width, height));
  // }

  if (currentYRight < height) {
  rooms.push(new Room("Staircase", parkingWidth + CORRIDOR_WIDTH, currentYRight, width, height));
}

  return {
    boundaries: { width, height },
    rooms: rooms.map((r) => ({
      name: r.name,
      x1: +r.x1.toFixed(2),
      y1: +r.y1.toFixed(2),
      x2: +r.x2.toFixed(2),
      y2: +r.y2.toFixed(2),
      area: +calculateArea(r.x1, r.y1, r.x2, r.y2).toFixed(2),
    })),
  };
}

module.exports= allocateRooms ;
