export default function Palette({ palette }: { palette: string[] }) {
  return palette.map((color) => (
    <div
      className={`size-8 ${
        color == "#00000000"
          ? "bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] rounded-tl-xl rounded-br-xl"
          : "border border-black"
      }`}
      key={color}
      style={{ backgroundColor: color }}
    />
  ));
}
