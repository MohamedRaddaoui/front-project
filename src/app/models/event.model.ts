export interface Attachments {
  filename: String;
  path: String;
  mimetype: String;
  originalname: String;
}

export class Event {
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  location?: string;
  type: string;
  status?: string;
  visibility?: string;
  createdBy: string;
  attachments?: Attachments[];
  [key: string]: any;
  constructor(
    title: string,
    date: string,
    startTime: string,
    endTime: string,
    type: string,
    createdBy: string,
    location?: string,
    status?: string,
    visibility?: string,
    attachments?: Attachments[]
  ) {
    this.title = title;
    this.date = date;
    this.startTime = startTime;
    this.endTime = endTime;
    this.type = type;
    this.createdBy = createdBy;
    this.location = location;
    this.status = status;
    this.visibility = visibility;
    this.attachments = attachments;
  }
}
