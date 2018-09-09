
import React, { Component } from "react"
import {StyleSheet, View} from 'react-native'
import {
    ComposableMap,
    ZoomableGlobe,
    ZoomableGroup,
    Geographies,
    Geography,
} from "../../src"

import map from "../../static/world-50m"

// import { PatternLines } from "@vx/pattern"
// TODO: Can't be used with PatternLines because vx library is for react and web svg tags must be changed to native ones

class PatternMap extends Component {
    render() {
        console.log("Render")
        return (
            <View style={styles.container}>
                <ComposableMap
                    projectionConfig={{
                        scale: 205,
                        rotation: [-11,0,0],
                    }}
                    width={980}
                    height={551}
                    style={{
                        width: "100%",
                        height: "auto",
                    }}
                    // defs={
                    //     <PatternLines
                    //         id="lines"
                    //         height={4}
                    //         width={4}
                    //         stroke="#607D8B"
                    //         strokeWidth={0.75}
                    //         orientation={["diagonal"]}
                    //     />
                    // }
                >
                    <ZoomableGroup center={[0,20]} disablePanning>
                        <Geographies geography={map}>
                            {(geographies, projection) => geographies.map((geography, i) => geography.id !== "ATA" && (
                                <Geography
                                    key={i}
                                    geography={geography}
                                    projection={projection}
                                    style={{
                                        default: {
                                            fill: "url(#lines)",
                                            stroke: "#607D8B",
                                            strokeWidth: 0.75,
                                            outline: "none",
                                        },
                                        hover: {
                                            fill: "#607D8B",
                                            stroke: "#607D8B",
                                            strokeWidth: 0.75,
                                            outline: "none",
                                        },
                                        pressed: {
                                            fill: "#FF5722",
                                            stroke: "#607D8B",
                                            strokeWidth: 0.75,
                                            outline: "none",
                                        },
                                    }}
                                />
                            ))}
                        </Geographies>
                    </ZoomableGroup>
                </ComposableMap>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
})

export { PatternMap }
