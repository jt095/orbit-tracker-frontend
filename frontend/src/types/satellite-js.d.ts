declare module "satellite.js" {
  export function twoline2satrec(line1: string, line2: string): any;
  export function propagate(satrec: any, date: Date): { position: any; velocity: any };
  export function gstime(date: Date): number;
  export function eciToGeodetic(positionEci: any, gmst: number): any;
  export function degreesLat(rad: number): number;
  export function degreesLong(rad: number): number;
}