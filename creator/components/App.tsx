import Button from "./Button";
import Palettes from "./Palettes";
import { usePopup } from "../hooks/usePopup";
import { useEffect } from "react";
import ColorSelector from "./ColorSelector";
import Pixel from "./Pixel";
import { useImage } from "../hooks/useImage";
import { usePalette } from "../hooks/usePalette";

function exportImageData(imageData: number[][], paletteIndex: number) {
  const exportedData: (number | null)[] = [];

  imageData.forEach((row) => {
    row.forEach((color) => {
      exportedData.push(color || 0);
    });
  });

  navigator.clipboard.writeText(JSON.stringify({palette: paletteIndex, colors: exportedData}));
}

export default function App() {
  const { popup, setPopup } = usePopup();
  const { pixels } = useImage();
  const { selected } = usePalette();

  useEffect(() => {
    document.addEventListener("keydown", (e) => {
      if (e.key == "Escape") setPopup("none");
    });
  }, []);

  return (
    <div className="flex">
      <div className="w-80 p-5 h-screen bg-neutral-800">
        <div className="flex gap-5">
          <Button
            mode="secondary"
            className="w-1/2"
            onClick={() => setPopup("palette")}
          >
            Select Palette
          </Button>

          <Button
            mode="primary"
            className="w-1/2"
            onClick={() => exportImageData(pixels, selected)}
          >
            Export
          </Button>
        </div>

        <div className="my-5" />

        <ColorSelector />

        {popup == "palette" && (
          <>
            <div className="absolute top-1/2 left-1/2 -translate-1/2 z-50">
              <Palettes />
            </div>
            <div
              className="absolute bg-black/50 z-40 w-screen h-screen top-0 left-0"
              onClick={() => setPopup("none")}
            ></div>
          </>
        )}
      </div>

      <div className="bg-black flex-grow">
        <div className="grid grid-cols-8 aspect-square">
          {[...Array(8)].map((_, y) =>
            [...Array(8)].map((_, x) => <Pixel x={x} y={y} key={`${x},${y}`} />)
          )}
        </div>
      </div>
    </div>
  );
}
