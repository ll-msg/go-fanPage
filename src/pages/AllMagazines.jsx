import { useMemo } from "react";
import { useWorks } from "../store/worksStore";
import MagazineBrowser from "../components/MagazineBrowser.jsx";
import { adaptAllMagazine, workKey } from "../utils/magazine.js";

export default function AllMagazines() {
    const { allMagazines, works } = useWorks();
    const worksByKey = useMemo(() => new Map((works || []).map((w) => [workKey(w), w])), [works]);
    const items = useMemo(
        () => (allMagazines || []).map((item, i) => adaptAllMagazine(item, i, worksByKey)),
        [allMagazines, worksByKey]
    );
    return <MagazineBrowser items={items} type="cover" />;
}
