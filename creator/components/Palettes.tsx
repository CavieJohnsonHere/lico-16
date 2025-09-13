import { COLOR_PALETTES } from "../../scripts/constants";
import { usePalette } from "../hooks/usePalette";
import { usePopup } from "../hooks/usePopup";
import Palette from "./Palette";

export default function Palettes() {
  const paletteState = usePalette();
  const { setPopup } = usePopup();

  return (
    <div className="p-5 w-fit flex flex-col gap-4 bg-neutral-900 rounded-2xl">
      <div className="text-neutral-700 hover:underline cursor-pointer" onClick={() => setPopup("none")}>close</div>

      {paletteState.selected < 0 ? (
        <div className="text-neutral-500 text-center p-1">
          You have not selected any palettes.
        </div>
      ) : (
        <div className="text-neutral-500 text-center p-1">
          Your selected pallete is index number {paletteState.selected}
        </div>
      )}

      {COLOR_PALETTES.map((palette, index) => (
        <div
          className={`flex gap-1 p-1 ${index == paletteState.selected ? "bg-neutral-300 [--pattern-fg:var(--color-black)]/10" : "[--pattern-fg:var(--color-white)]/10"}`}
          onClick={() => paletteState.setSelected(index)}
          key={index}
        >
          <Palette palette={palette} />
        </div>
      ))}
    </div>
  );
}
