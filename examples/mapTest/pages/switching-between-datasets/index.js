import React, { Component } from "react"
import {
    ComposableMap,
    ZoomableGroup,
    Geographies,
    Geography,
} from "../../src"
import chroma from "chroma-js"
import { scaleLinear } from "d3-scale"
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native'
import world from '../../static/world-50m-with-population-switching-between-datasets'

const colorScale = chroma
    .scale([
        '#FF6E40',
        'FFD740',
        '#00B8D4',
    ])
    .mode('lch')
    .colors(24)

const subregions = [
    "Southern Asia",
    "Polynesia",
    "Micronesia",
    "Southern Africa",
    "Central Asia",
    "Melanesia",
    "Western Europe",
    "Central America",
    "Seven seas (open ocean)",
    "Northern Africa",
    "Caribbean",
    "South-Eastern Asia",
    "Eastern Africa",
    "Australia and New Zealand",
    "Eastern Europe",
    "Western Africa",
    "Southern Europe",
    "Eastern Asia",
    "South America",
    "Middle Africa",
    "Antarctica",
    "Northern Europe",
    "Northern America",
    "Western Asia",
]

const popScale = scaleLinear()
    .domain([0,100000000,1400000000])
    .range(["#CFD8DC","#607D8B","#37474F"])

// TODO: Not working
class UpdatableChoropleth extends Component {
    constructor() {
        super()

        this.state = {
            populationData: true,
        }

        this.switchToPopulation = this.switchToPopulation.bind(this)
        this.switchToRegions = this.switchToRegions.bind(this)
    }
    switchToPopulation() {
        this.setState({ populationData: true })
    }

    switchToRegions() {
        this.setState({ populationData: false })
    }
    render() {
        return (
            <View>
                <View>
                    <TouchableOpacity onClick={ this.switchToPopulation }>
                        <View style={{ height: 50, width: 50 }}>
                            <Text>
                                { "Population data" }
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onClick={ this.switchToRegions }>
                        <View style={{ height: 50, width: 50 }}>
                            <Text>
                                { "World subregions" }
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
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
                            <Geographies
                                geography={world}
                                disableOptimization
                            >
                                {(geographies, projection) =>
                                    geographies.map((geography, i) => (
                                        <Geography
                                            key={`${geography.properties.iso_a3}-${i}`}
                                            cacheId={`${geography.properties.iso_a3}-${i}`}
                                            geography={ geography }
                                            projection={ projection }
                                            onClick={ this.handleClick }
                                            round
                                            style={{
                                                default: {
                                                    fill: this.state.populationData
                                                        ? popScale(geography.properties.pop_est)
                                                        : colorScale[subregions.indexOf(geography.properties.subregion)],
                                                    stroke: "#607D8B",
                                                    strokeWidth: 0.75,
                                                    outline: "none",
                                                },
                                                hover: {
                                                    fill: this.state.populationData
                                                        ? "#263238"
                                                        : chroma(colorScale[subregions.indexOf(geography.properties.subregion)]).darken(0.5),
                                                    stroke: "#607D8B",
                                                    strokeWidth: 0.75,
                                                    outline: "none",
                                                },
                                                pressed: {
                                                    fill: this.state.populationData
                                                        ? "#263238"
                                                        : chroma(colorScale[subregions.indexOf(geography.properties.subregion)]).brighten(0.5),
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

export { UpdatableChoropleth }
