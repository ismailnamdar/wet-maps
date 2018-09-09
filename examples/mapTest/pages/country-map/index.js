// TODO: Not working both web and mobile
import React, { Component } from "react"
import {
    ComposableMap,
    ZoomableGroup,
    Geographies,
    Geography,
} from "../../src"
import world from '../../static/ch-with-cantons'
import {StyleSheet, View} from "react-native";

class CountryMap extends Component {
    render() {
        return (
            <View style={styles.container}>
                <ComposableMap
                    projection="mercator"
                    projectionConfig={{ scale: 1000 }}
                    width={980}
                    height={551}
                    style={{
                        width: "100%",
                        height: "auto",
                    }}
                >
                    <ZoomableGroup center={[ 8.2, 46.8 ]} disablePanning>
                        <Geographies geography={world}>
                            {(geographies, projection) =>
                                geographies.map((geography, i) =>
                                    geography.id !== "ATA" && (
                                        <Geography
                                            key={i}
                                            geography={geography}
                                            projection={projection}
                                            style={{
                                                default: {
                                                    fill: "#ECEFF1",
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
        width: "100%",
        // maxHeight: 1000,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    }
});

export { CountryMap }
