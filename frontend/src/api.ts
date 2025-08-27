import type { CountryCode, GpData, TLEData } from "./types/types";

export async function fetchGpData(
    days?: number,
    countryCode?: CountryCode
): Promise<GpData[]> {
    const url = new URL("http://localhost:8080/api/gp/static");

    if (days !== undefined) {
        url.searchParams.append("days", days.toString());
    }

    if (countryCode !== undefined) {
        url.searchParams.append("countryCode", countryCode);
    }

    console.log(url.toString());
    const res = await fetch(url.toString());
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