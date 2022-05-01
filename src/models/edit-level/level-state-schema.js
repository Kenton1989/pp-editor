export const levelStateSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  $ref: "#/definitions/LevelState",
  definitions: {
    LevelState: {
      type: "object",
      properties: {
        header: {
          $ref: "#/definitions/HeaderState",
        },
        blocks: {
          type: "array",
          items: {
            $ref: "#/definitions/BlockState",
          },
        },
        counter: {
          type: "number",
        },
      },
      required: ["header", "blocks", "counter"],
      additionalProperties: false,
    },
    HeaderState: {
      type: "object",
      properties: {
        version: {
          type: "string",
          const: "4",
        },
        attemptOrder: {
          $ref: "#/definitions/AttemptOrder",
        },
        shed: {
          type: "boolean",
        },
        innerPush: {
          type: "boolean",
        },
        drawStyle: {
          $ref: "#/definitions/DrawStyle",
        },
        customLevelMusic: {
          type: "number",
        },
        customLevelPalette: {
          type: "number",
        },
        title: {
          type: "string",
        },
      },
      required: [
        "attemptOrder",
        "customLevelMusic",
        "customLevelPalette",
        "drawStyle",
        "innerPush",
        "shed",
        "title",
        "version",
      ],
      additionalProperties: false,
    },
    AttemptOrder: {
      type: "array",
      items: {
        $ref: "#/definitions/AttemptAction",
      },
      minItems: 4,
      maxItems: 4,
    },
    AttemptAction: {
      type: "string",
      enum: ["push", "enter", "eat", "possess"],
    },
    DrawStyle: {
      type: "string",
      enum: ["", "tui", "grid", "oldstyle"],
    },
    BlockState: {
      type: "object",
      properties: {
        id: {
          type: "number",
        },
        name: {
          type: "string",
        },
        width: {
          type: "number",
        },
        height: {
          type: "number",
        },
        hsl: {
          $ref: "#/definitions/HslColor",
        },
        zoomFactor: {
          type: "number",
        },
        fillWithWalls: {
          type: "boolean",
        },
        floatInSpace: {
          type: "boolean",
        },
        specialEffect: {
          type: "number",
        },
        grid: {
          $ref: "#/definitions/Grid",
        },
      },
      required: [
        "id",
        "name",
        "width",
        "height",
        "hsl",
        "zoomFactor",
        "fillWithWalls",
        "floatInSpace",
        "specialEffect",
        "grid",
      ],
      additionalProperties: false,
    },
    HslColor: {
      anyOf: [
        {
          type: "array",
          items: {
            type: "number",
          },
          minItems: 3,
          maxItems: 3,
        },
        {
          $ref: "#/definitions/DefaultColor",
        },
      ],
    },
    DefaultColor: {
      type: "string",
      enum: [
        "root block",
        "block color 1",
        "block color 2",
        "block color 3",
        "box",
        "player",
      ],
    },
    Grid: {
      type: "array",
      items: {
        type: "array",
        items: {
          anyOf: [
            {
              $ref: "#/definitions/Cell",
            },
            {
              type: "null",
            },
          ],
        },
      },
    },
    Cell: {
      anyOf: [
        {
          $ref: "#/definitions/RefCell",
        },
        {
          $ref: "#/definitions/WallCell",
        },
        {
          $ref: "#/definitions/FloorCell",
        },
        {
          $ref: "#/definitions/SimplePlayerCell",
        },
        {
          $ref: "#/definitions/BoxCell",
        },
      ],
    },
    RefCell: {
      type: "object",
      properties: {
        x: {
          type: "number",
        },
        y: {
          type: "number",
        },
        id: {
          type: "number",
        },
        exitBlock: {
          type: "boolean",
        },
        infExit: {
          type: "boolean",
        },
        infExitNum: {
          type: "number",
        },
        infEnter: {
          type: "boolean",
        },
        infEnterNum: {
          type: "number",
        },
        infEnterId: {
          type: "number",
        },
        player: {
          type: "boolean",
        },
        possessable: {
          type: "boolean",
        },
        playerOrder: {
          type: "number",
        },
        flipH: {
          type: "boolean",
        },
        floatInSpace: {
          type: "boolean",
        },
        specialEffect: {
          type: "number",
        },
        cellType: {
          type: "string",
          const: "Ref",
        },
      },
      required: [
        "cellType",
        "exitBlock",
        "flipH",
        "floatInSpace",
        "id",
        "infEnter",
        "infEnterId",
        "infEnterNum",
        "infExit",
        "infExitNum",
        "player",
        "playerOrder",
        "possessable",
        "specialEffect",
        "x",
        "y",
      ],
      additionalProperties: false,
    },
    WallCell: {
      type: "object",
      properties: {
        x: {
          type: "number",
        },
        y: {
          type: "number",
        },
        player: {
          type: "boolean",
        },
        possessable: {
          type: "boolean",
        },
        playerOrder: {
          type: "number",
        },
        cellType: {
          type: "string",
          const: "Wall",
        },
      },
      required: ["cellType", "player", "playerOrder", "possessable", "x", "y"],
      additionalProperties: false,
    },
    FloorCell: {
      type: "object",
      properties: {
        x: {
          type: "number",
        },
        y: {
          type: "number",
        },
        floorType: {
          $ref: "#/definitions/FloorType",
        },
        cellType: {
          type: "string",
          const: "Floor",
        },
      },
      required: ["cellType", "floorType", "x", "y"],
      additionalProperties: false,
    },
    FloorType: {
      type: "string",
      enum: ["PlayerButton", "Button"],
    },
    SimplePlayerCell: {
      type: "object",
      properties: {
        cellType: {
          type: "string",
          const: "SimplePlayer",
        },
        x: {
          type: "number",
        },
        y: {
          type: "number",
        },
        hsl: {
          $ref: "#/definitions/HslColor",
        },
        player: {
          type: "boolean",
        },
        possessable: {
          type: "boolean",
        },
        playerOrder: {
          type: "number",
        },
      },
      required: [
        "cellType",
        "x",
        "y",
        "hsl",
        "player",
        "possessable",
        "playerOrder",
      ],
      additionalProperties: false,
    },
    BoxCell: {
      type: "object",
      properties: {
        cellType: {
          type: "string",
          const: "Box",
        },
        x: {
          type: "number",
        },
        y: {
          type: "number",
        },
        hsl: {
          $ref: "#/definitions/HslColor",
        },
      },
      required: ["cellType", "x", "y", "hsl"],
      additionalProperties: false,
    },
  },
};
export default levelStateSchema;
