import type { GpData } from "../../types/types";

interface Props {
    gpData: GpData[];
}

export default function GpList({ gpData }: Props) {
    return (
        <ul>
            {gpData.map((sat, i) => (
                <li key={i}>
                    {sat.OBJECT_NAME} - Launched {sat.LAUNCH_DATE}
                </li>
            ))}
        </ul>
    );
}