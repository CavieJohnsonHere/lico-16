import { COLOR_PALETTES } from "../../scripts/constants";
import { useColor } from "../hooks/useColor";
import { usePalette } from "../hooks/usePalette";

export default function ColorSelector() {
  const paletteColors =
    COLOR_PALETTES[usePalette((state) => state.selected)] || [];

  const selectedColor = useColor();

  return (
    <div className="grid grid-cols-4 gap-4 [--pattern-fg:var(--color-white)]/10">
      {paletteColors.length == 0 && (
        <div className="text-neutral-300 col-span-4">
          No palette selected. Please select one using the button above.
        </div>
      )}
      {paletteColors.map((color) => (
        <div
          className={`w-full aspect-square cursor-pointer hover:border-2 ${
            color == "#00000000"
              ? "bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px]"
              : "border border-black"
          }
          
          ${selectedColor.selected == paletteColors.indexOf(color) ? "border-blue-700" : ""}`}
          key={color}
          onClick={() => selectedColor.setSelected(paletteColors.indexOf(color))}
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  );
}
