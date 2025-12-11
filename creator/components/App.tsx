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

  navigator.clipboard.writeText(JSON.stringify({palette: paletteIndex, pixels: exportedData}));
}

function importImageData(setPixel: (x: number, y: number, colorIndex: number) => void, setSelected: (value: number) => void) {
  navigator.clipboard.readText().then((text) => {
    try {
      const data = JSON.parse(text);
      
      if (data.palette !== undefined && Array.isArray(data.pixels)) {
        setSelected(data.palette);
        
        data.pixels.forEach((colorIndex: number, index: number) => {
          const x = index % 8;
          const y = Math.floor(index / 8);
          setPixel(x, y, colorIndex);
        });
      } else {
        alert("Invalid import data format");
      }
    } catch (e) {
      alert("Failed to parse clipboard data");
    }
  }).catch(() => {
    alert("Failed to read from clipboard");
  });
}

export default function App() {
  const { popup, setPopup } = usePopup();
  const { pixels, setPixel, clear } = useImage();
  const { selected, setSelected } = usePalette();

  useEffect(() => {
    document.addEventListener("keydown", (e) => {
      if (e.key == "Escape") setPopup("none");
    });
  }, []);

  return (
    <div className="flex">
      <div className="w-80 p-5 h-screen bg-neutral-800">
        <div className="grid grid-cols-2 gap-5">
          <Button
            mode="secondary"
            className="w-1/2"
            onClick={() => setPopup("palette")}
          >
            Select Palette
          </Button>

          <Button
            mode="secondary"
            className="w-1/2"
            onClick={() => importImageData(setPixel, setSelected)}
          >
            Import
          </Button>

          <Button
            mode="secondary"
            className="w-1/2"
            onClick={clear}
          >
            Reset
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
        <div className="grid grid-cols-8 aspect-square h-screen">
          {[...Array(8)].map((_, y) =>
            [...Array(8)].map((_, x) => <Pixel x={x} y={y} key={`${x},${y}`} />)
          )}
        </div>
      </div>
    </div>
  );
}
