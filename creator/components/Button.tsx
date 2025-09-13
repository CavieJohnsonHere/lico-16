export default function Button({
  children,
  mode,
  onClick,
  className
}: {
  children: React.ReactNode;
  mode?: "primary" | "secondary";
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string
}) {
  const classes = {
    primary:
      "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer py-2 px-4 rounded-lg transition duration-100 " + className,
    secondary:
      "bg-gray-600 hover:bg-gray-700 text-white cursor-pointer py-2 px-4 rounded-lg transition duration-100 " + className,
  } as const;

  return (
    <button className={classes[mode ? mode : "primary"]} onClick={onClick}>
      {children}
    </button>
  );
}
