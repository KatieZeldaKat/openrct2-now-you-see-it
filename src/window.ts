// @ts-ignore
import * as info from "./info.js";

export const window: WindowDesc = createWindow();
export const tool: ToolDesc = createTool();

const tileSize = 32;
var selectStart: CoordsXY;


function setVisibility(tile: Tile)
{
    park.postMessage(`(${tile.x}, ${tile.y})`);
}


function createWindow(): WindowDesc
{
    return {
        classification: info.name,
        title: "Now You See It!",
        colours: [ 5, 4 ],
        width: 200,
        height: 45,
        widgets: [{
            type: "button",
            text: "Activate Selection",
            x: 10,
            y: 20,
            height: 20,
            width: 180,
            onClick() {
                ui.activateTool(tool);
            }
        }],
        onClose() {
            ui.tool?.cancel();
        },
    };
}


function createTool(): ToolDesc
{
    return {
        id: info.name,
        cursor: "cross_hair",
        filter: [ "terrain" ],
        onDown(e) {
            selectStart = getMapCoords(e.mapCoords);
        },
        onUp(_) {
            var selected = ui.tileSelection.range;
            if (selected == null)
            {
                return;
            }

            for (var x = selected.leftTop.x; x <= selected.rightBottom.x; x += tileSize)
            {
                for (var y = selected.leftTop.y; y <= selected.rightBottom.y; y += tileSize)
                {
                    setVisibility(map.getTile(x / tileSize, y / tileSize));
                }
            }
        },
        onMove(e) {
            if (e.isDown)
            {
                selectRange(selectStart, getMapCoords(e.mapCoords));
            }
            else
            {
                ui.tileSelection.range = null;
                ui.tileSelection.tiles = [ getMapCoords(e.mapCoords) ];
            }
        }
    };
}


function selectRange(selectStart: CoordsXY, mapCoords: CoordsXY)
{
    const selectCoords = {
        x: mapCoords.x > 0 ? mapCoords.x : selectStart.x,
        y: mapCoords.y > 0 ? mapCoords.y : selectStart.y,
    };

    ui.tileSelection.range = {
        leftTop: {
            x: Math.min(selectStart.x, selectCoords.x),
            y: Math.min(selectStart.y, selectCoords.y),
        },
        rightBottom: {
            x: Math.max(selectStart.x, selectCoords.x),
            y: Math.max(selectStart.y, selectCoords.y),
        }
    }
}


function getMapCoords(mapCoords: CoordsXYZ | undefined): CoordsXY
{
    // Convert the coordinates to be defined, setting to 0 if not
	return {
		x: mapCoords?.x ?? 0 > 0 ? mapCoords?.x ?? 0 : 0,
		y: mapCoords?.y ?? 0 > 0 ? mapCoords?.y ?? 0 : 0,
	}
}
