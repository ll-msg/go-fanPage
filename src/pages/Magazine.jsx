import { useMemo } from "react";
import { useWorks } from "../store/worksStore";
import MagazineBrowser from "../components/MagazineBrowser.jsx";
import { adaptCoverMagazine } from "../utils/magazine.js";

export default function Magazine() {
    const { magazines } = useWorks();
    const items = useMemo(() => (magazines || []).map(adaptCoverMagazine), [magazines]);
    return <MagazineBrowser items={items} type="magazine" />;
}
