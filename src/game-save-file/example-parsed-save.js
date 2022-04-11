const EXAMPLE_SAVE = {
  blockType: "Root",
  version: "4", // required
  attemptOrder: ["push", "enter", "eat", "possess"], // attempt_order (used in Priority area in-game with value "enter,eat,push,possess".)
  shed: false, // enables Shed area behavior
  innerPush: false, //inner_push (enables Inner Push area behavior)
  // draw style:
  // "" (default style)
  // "tui" (Text graphics)
  // "grid" (Like tui, but with blocks instead of text)
  // "oldstyle" (Gallery area development graphics)
  drawStyle: "", // draw_style
  customLevelMusic: -1, //custom_level_music (-1 means no music)
  customLevelPalette: -1, // custom_level_palette (-1 means no palette is applied)
  children: [
    {
      // Block x y id width height hue sat val zoomfactor fillwithwalls player possessable playerorder fliph floatinspace specialeffect
      blockType: "Block",
      x: -1,
      y: -1,
      id: 0,
      width: 9,
      height: 9,
      hue: 0.6,
      sat: 0.8,
      val: 0.9,
      zoomFactor: 1,
      fillWithWalls: false,
      player: false,
      playerOrder: 0,
      possessable: false,
      flipH: false,
      floatInSpace: false,
      specialEffect: 0,
      children: [
        {
          // Ref x y id exitblock infexit infexitnum infenter infenternum infenterid player possessable playerorder fliph floatinspace specialeffect
          blockType: "Ref",
          x: 1,
          y: 1,
          id: 1,
          exitBlock: false,
          infExit: false,
          infExitNum: 0,
          infEnter: false,
          infEnterNum: 0,
          infEnterId: 0,
          player: false,
          possessable: false,
          playerOrder: 0,
          flipH: false,
          floatInSpace: false,
          specialEffect: 0,
        },
        {
          // Wall x y player possessable playerorder
          blockType: "Wall",
          x: 7,
          y: 1,
          player: false,
          possessable: false,
          playerOrder: 0,
        },
        {
          // Floor x y type(Button or PlayerButton)
          blockType: "Floor",
          x: 3,
          y: 3,
          floorType: "PlayerButton",
        },
      ],
    },
  ],
};
