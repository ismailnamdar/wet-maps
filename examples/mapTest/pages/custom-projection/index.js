
import React, { Component } from "react"
import {
    ComposableMap,
    ZoomableGroup,
    Geographies,
    Geography,
    Graticule,
} from "../../src"
import { geoAzimuthalEqualArea } from "d3-geo"
import {StyleSheet, View} from 'react-native'
import world from '../../static/world-50m'

// TODO: Rotation is not working in ZoomableGroup
class CustomProjectionMap extends Component {
    projection(width, height, config) {
        return geoAzimuthalEqualArea()
            .rotate([-10,-52,0])
            .scale(config.scale)
    }
    render() {
        return (
            <View style={styles.container}>
                <ComposableMap
                    projection={this.projection}
                    projectionConfig={{
                        scale: 200,
                    }}
                    width={980}
                    height={551}
                    style={{
                        width: "100%",
                        height: "auto",
                    }}
                >
                    <ZoomableGroup center={[10,52]}>
                        <Geographies geography={world}>
                            {(geographies, projection) => geographies.map((geography, i) => (
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
                        <Graticule />
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
});

export { CustomProjectionMap }
