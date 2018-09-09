
import React, { Component } from "react"
import {
    ComposableMap,
    ZoomableGroup,
    Geographies,
    Geography,
} from "../../src"
import { scaleLinear } from "d3-scale"
import {StyleSheet, View} from "react-native"
import world from '../../static/world-50m-with-population'

const popScale = scaleLinear()
    .domain([0,100000000,1400000000])
    .range(["#CFD8DC","#607D8B","#37474F"])

class ChoroplethMap extends Component {
    render() {
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
                >
                    <ZoomableGroup center={[0,20]}>
                        <Geographies geography={world}>
                            {(geographies, projection) => geographies.map((geography, i) => (
                                <Geography
                                    key={ i }
                                    geography={ geography }
                                    projection={ projection }
                                    onClick={ this.handleClick }
                                    style={{
                                        default: {
                                            fill: popScale(geography.properties.pop_est),
                                            stroke: "#607D8B",
                                            strokeWidth: 0.75,
                                            outline: "none",
                                        },
                                        hover: {
                                            fill: "#263238",
                                            stroke: "#607D8B",
                                            strokeWidth: 0.75,
                                            outline: "none",
                                        },
                                        pressed: {
                                            fill: "#263238",
                                            stroke: "#607D8B",
                                            strokeWidth: 0.75,
                                            outline: "none",
                                        }
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
});

export { ChoroplethMap }
