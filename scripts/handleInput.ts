export default function handleInput(e: KeyboardEvent) {
  if (e.key == "ArrowUp") {
    // Handle up arrow key
    console.log("Up arrow pressed");
  } else if (e.key == "ArrowDown") {
    // Handle down arrow key
    console.log("Down arrow pressed");
  } else if (e.key == "ArrowLeft") {
    // Handle left arrow key
    console.log("Left arrow pressed");
  } else if (e.key == "ArrowRight") {
    // Handle right arrow key
    console.log("Right arrow pressed");
  } else if (e.key == "x") {
    // Handle 'x' key
    console.log("'x' key pressed");
  } else if (e.key == "c") {
    // Handle 'c' key
    console.log("'c' key pressed");
  }
}