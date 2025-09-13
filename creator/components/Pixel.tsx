import { COLOR_PALETTES } from "../../scripts/constants";
import { useColor } from "../hooks/useColor";
import { useImage } from "../hooks/useImage";
import { usePalette } from "../hooks/usePalette";

export default function Pixel({ x, y }: { x: number; y: number }) {
  const { pixels, setPixel } = useImage();
  const paletteColors =
    COLOR_PALETTES[usePalette((state) => state.selected)] || [];
  const { selected } = useColor()

  return (
    <div
      className={`w-full aspect-square border border-white/10 outline ouline-black/10 ${selected == -1 ? "cursor-not-allowed" : "cursor-copy"}`}
      style={{
        backgroundColor:
          pixels[y] != undefined && pixels[y][x] != undefined ? (pixels[y][x] == -1 ? "#f0f0f0" : paletteColors[pixels[y][x]]) : "#ff0000",
      }}
      onMouseDown={() => {
        if (selected != -1) setPixel(x, y, selected);
      }}
      onContextMenu={e => {
        e.preventDefault();
        setPixel(x, y, 0);
      }}
      title={selected == -1 ? "Select a color first" : ""}
    />
  );
}
