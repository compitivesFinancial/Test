export class CampainAttachement {
  constructor(
    public id: string,
    public campaignId: string,
    public attachment: string,
    public ext: string,
    public status: string
  ) {}
}
