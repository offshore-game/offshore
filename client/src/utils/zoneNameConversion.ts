import { zoneNames } from "../API/requests";

export default function toVisualZoneName(zoneName: zoneNames) {

    if (zoneName == "backMast") {

        return "Back Mast"

    } else if (zoneName == "captainDeck") {

        return "Captain's Deck"

    } else if (zoneName == "controlRoom") {

        return "Control Room"

    } else if (zoneName == "crewmateDeck") {

        return "Crewmates' Deck"

    } else if (zoneName == "emergencyDeck") {

        return "Emergency Deck"

    } else if (zoneName == "engineRoom") {

        return "Engine Room"

    } else if (zoneName == "entertainmentRoom") {
        
        return "Entertainment Room"

    } else if (zoneName == "frontMast") {

        return "Front Mast"

    } else if (zoneName == "operationCenter") {

        return "Operation Center"

    } else if (zoneName == "secondaryDeck") {
        
        return "Secondary Deck"

    }

}