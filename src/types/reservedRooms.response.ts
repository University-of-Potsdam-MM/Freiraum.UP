export interface IRoomList {
  room: string[];
}

export interface IPersonList {
  person: string[];
}

export interface IRoomReservation {
  endTime: Date;
  startTime: Date;
  roomList: IRoomList;
  personList: IPersonList;
  veranstaltung: string;
}

export interface IResponse {
  return: IRoomReservation[];
}

export interface ReservedRoomsResponse {
  reservationsResponse: IResponse;
}


