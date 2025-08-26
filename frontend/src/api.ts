import type { GpData, TLEData } from "./types/types";

export async function fetchGpData(): Promise<GpData[]> {
    const res = await fetch("http://localhost:8080/api/gp");
    if (!res.ok) {
        throw new Error(`Error: ${res.status} ${res.statusText}`);        
    }
    return res.json();
}

export async function fetchStarlinkTLEData(): Promise<TLEData[]> {
    const res = await fetch("http://localhost:8080/api/starlink/static");
    if (!res.ok) {
        throw new Error(`Error: ${res.status} ${res.statusText}`);        
    }
    return res.json();
}