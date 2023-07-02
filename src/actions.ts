import { VisibilityFilter } from "./data";

const tileSize = 32;
const toggleInvisibilitySetting = 2;
const showParkFencesSetting = 7;
const permissionErrorTitle = "Can't do this...";
const permissionErrorMessage = "Permission denied (Modify Tile)";


export function processSelectedArea(visible: boolean, filter: VisibilityFilter)
{
    if (!currentPlayerHasPermissions())
    {
        ui.showError(permissionErrorTitle, permissionErrorMessage);
        return;
    }

    var selected = ui.tileSelection.range;
    if (selected == null)
    {
        return;
    }

    for (var x = selected.leftTop.x; x <= selected.rightBottom.x; x += tileSize)
    {
        for (var y = selected.leftTop.y; y <= selected.rightBottom.y; y += tileSize)
        {
            setTileVisibility(x, y, visible, filter);
        }
    }
}


function setTileVisibility(x: number, y: number, visible: boolean, filter: VisibilityFilter)
{
    var tile: Tile = map.getTile(x / tileSize, y / tileSize);
    tile.elements.forEach((element, index) =>{
        if (element.type === "track")
        {
            if (filter.track && element.isHidden == visible)
            {
                setElementVisibility(x, y, index);
            }
        }
        else if (element.type === "entrance")
        {
            if (filter.entrance && element.isHidden == visible)
            {
                setElementVisibility(x, y, index);
            }
        }
        else if (element.type === "small_scenery" ||
                element.type === "banner" ||
                element.type === "wall")
        {
            if (filter.smallScenery && element.isHidden == visible)
            {
                setElementVisibility(x, y, index);
            }
        }
        else if (element.type === "large_scenery")
        {
            if (filter.largeScenery && element.isHidden == visible)
            {
                setElementVisibility(x, y, index);
            }
        }
        else if (element.type === "footpath")
        {
            if (filter.footpath && element.isHidden == visible)
            {
                setElementVisibility(x, y, index);
            }
        }
        else if (element.type === "surface")
        {
            if (filter.parkFence && !element.hasOwnership)
            {
                setParkFenceVisibility(x, y, visible);
            }
        }
    });
}


function setElementVisibility(x: number, y: number, index: number)
{
    context.executeAction("tilemodify", <TileModifyArgs>{
        x: x,
        y: y,
        setting: toggleInvisibilitySetting,
        value1: index,
        value2: 0,
    });
}


function setParkFenceVisibility(x: number, y: number, visible: boolean)
{
    context.executeAction("tilemodify", <TileModifyArgs>{
        x: x,
        y: y,
        setting: showParkFencesSetting,
        value1: visible ? 1 : 0,
        value2: 0,
    });
}


function currentPlayerHasPermissions(): boolean
{
    if (network.mode == "none")
    {
        return true;
    }

    var playerGroup: PlayerGroup = network.getGroup(network.currentPlayer.group);
    return playerGroup.permissions.indexOf("modify_tile") >= 0;
}
