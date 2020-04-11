import bricks from "bricks.js";

export default () => {
  const instance = bricks({
    container: ".js-misc",
    packed: "data-packed",
    sizes: [
      { columns: 2, gutter: 10 },
      { mq: "768px", columns: 3, gutter: 25 },
      { mq: "1024px", columns: 4, gutter: 50 }
    ]
  });

  instance
    .resize(true) // bind resize handler
    .pack(); // pack initial items

  setInterval(() => {
  }, 500);
};
