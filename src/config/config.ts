export default class DatabaseConfig {
  public secret: string = 'super secret passphrase';
  public database: string = 'mongodb://localhost:27017';
  public port: any = process.env.PORT || 3000;
}