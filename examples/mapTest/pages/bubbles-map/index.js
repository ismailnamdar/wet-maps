
import React, { Component } from "react"
import {
    ComposableMap,
    ZoomableGroup,
    Geographies,
    Geography,
    Markers,
    Marker,
} from "../../src"
import { StyleSheet, View } from 'react-native'
import { scaleLinear } from "d3-scale"
import world from '../../static/world-50m-bubbles-map'
import cities from '../../static/world-most-populous-cities-bubbles-map'
import { Circle } from 'react-native-svg'

const cityScale = scaleLinear()
    .domain([0,37843000])
    .range([1,25])

class BubblesMap extends Component {
    constructor() {
        super()
        this.state = {
            cities: cities,
        }
        // this.fetchCities = this.fetchCities.bind(this)
    }
    componentDidMount() {
        // this.fetchCities()
    }
    // fetchCities() {
    //     request
    //         .get("/static/world-most-populous-cities.json")
    //         .then(res => {
    //             this.setState({
    //                 cities: res.data,
    //             })
    //         })
    // }
    render() {
        return (
            <View style={styles.container}>
                <ComposableMap
                    projectionConfig={{ scale: 205 }}
                    width={980}
                    height={551}
                    style={{
                        width: "100%",
                        height: "auto",
                    }}
                >
                    <ZoomableGroup center={[0,20]} disablePanning>
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
                                                    fill: "#ECEFF1",
                                                    stroke: "#607D8B",
                                                    strokeWidth: 0.75,
                                                    outline: "none",
                                                },
                                                pressed: {
                                                    fill: "#ECEFF1",
                                                    stroke: "#607D8B",
                                                    strokeWidth: 0.75,
                                                    outline: "none",
                                                },
                                            }}
                                        />
                                    ))}
                        </Geographies>
                        <Markers>
                            {
                                this.state.cities.map((city, i) => (
                                    <Marker key={i} marker={city}>
                                        <Circle
                                            cx={0}
                                            cy={0}
                                            r={cityScale(city.population)}
                                            fill="rgba(255,87,34,0.8)"
                                            stroke="#607D8B"
                                            strokeWidth="2"
                                        />
                                    </Marker>
                                ))
                            }
                        </Markers>
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

export { BubblesMap }
