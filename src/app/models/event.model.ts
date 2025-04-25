export class Event {
  title: String;
  date: String;
  startTime: String;
  endTime: String;
  location?: String;
  type: String;
  status?: String;
  visibility?: String;
  createdBy: String;
  attachments?: File[];
  [key: string]: any;
  constructor(
    title: String,
    date: String,
    startTime: String,
    endTime: String,
    type: String,
    createdBy: String,
    location?: String,
    status?: String,
    visibility?: String,
    attachments?: File[]
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
