
import React, { Component } from "react"
import {StyleSheet, View} from 'react-native'
import {
    ComposableMap,
    ZoomableGlobe,
    Geographies,
    Geography,
    Graticule,
    Markers,
    Marker,
} from "../../src"
import { scaleLinear } from "d3-scale"
import { VictoryPie } from 'victory-native'
import { G, Circle } from "react-native-svg"
import cities from "../../static/world-most-populous-cities.json"
import world from '../../static/world-110m-globe'

const populationScale = scaleLinear()
    .domain([10750000,37843000])
    .range([5,22])

class Globe extends Component {
    render() {
        console.log("Render")
        return (
            <View style={styles.container}>
                <ComposableMap
                    projection="orthographic"
                    projectionConfig={{
                        scale: 300,
                    }}
                    width={800}
                    height={800}
                    style={{
                        width: "100%",
                        height: "auto",
                        backgroundColor: "#0f1f1f",
                        color: "blue"
                    }}
                >
                    <ZoomableGlobe style={{backgroundColor: 'blue'}} parentWidth={800} parentHeight={800} center={[96,32]}>
                        <Circle cx={400} cy={400} r={300} fill="#b9e7ff" stroke="#eceff1" />
                        <Geographies geography={world} disableOptimization>
                            {(geographies, projection) =>
                                geographies.map((geography, i) => {
                                        return (
                                            <Geography
                                                key={i}
                                                round
                                                geography={geography}
                                                projection={projection}
                                                style={{
                                                    default: {
                                                        fill: "#eceff1",
                                                        stroke: "#607D8B",
                                                        strokeWidth: 0.75,
                                                        outline: "none",
                                                    },
                                                    hover: {
                                                        fill: "#eceff1",
                                                        stroke: "#607D8B",
                                                        strokeWidth: 0.75,
                                                        outline: "none",
                                                    },
                                                    pressed: {
                                                        fill: "#eceff1",
                                                        stroke: "#607D8B",
                                                        strokeWidth: 0.75,
                                                        outline: "none",
                                                    },
                                                }}
                                            />
                                        )
                                    }
                                )}
                        </Geographies>
                        <Markers>
                            {
                                cities.map(city => {
                                    const radius = populationScale(city.population)
                                    return (
                                        <Marker
                                            key={city.name}
                                            marker={city}
                                            style={{
                                                default: { opacity: 0.8 },
                                                hidden: { display: "none" },
                                            }}>
                                            {/*<Circle*/}
                                                {/*cx={0}*/}
                                                {/*cy={0}*/}
                                                {/*r={radius}*/}
                                                {/*fill="#FF5722"*/}
                                                {/*stroke="#FFF"*/}
                                            {/*/>*/}
                                            {/*<Circle*/}
                                                {/*cx={0}*/}
                                                {/*cy={0}*/}
                                                {/*r={radius + 2}*/}
                                                {/*fill="transparent"*/}
                                                {/*stroke="#FF5722"*/}
                                            {/*/>*/}
                                            <G transform={{ translate: "-15, -15" }}>
                                                <Circle cx={20} cy={20} r={21} fill="transparent" stroke="#607D8B" strokeWidth={1}/>
                                                <Circle cx={20} cy={20} r={9} fill="transparent" stroke="#607D8B" strokeWidth={1}/>
                                                <VictoryPie
                                                    standalone={ false }
                                                    width={ 40 }
                                                    height={ 40 }
                                                    padding={ 0 }
                                                    innerRadius={ 10 }
                                                    style={{
                                                        labels: { fill: "transparent" },
                                                        data: { stroke: "#ECEFF1" },
                                                    }}
                                                    colorScale={["tomato", "orange", "gold", "cyan", "navy" ]}
                                                    data={[
                                                        { x: null, y: 60, fill: "#FF5722" },
                                                        { x: null, y: 20, fill: "#00BCD4" },
                                                        { x: null, y: 10, fill: "#FFC107" },
                                                        { x: null, y: 10, fill: "#8BC34A" },
                                                    ]}
                                                    events={[{
                                                        eventHandlers: {
                                                            onClick: () => {
                                                                this.setState({isLoading: true});
                                                            }
                                                        }
                                                    }]}
                                                />
                                            </G>
                                        </Marker>
                                    )
                                })
                            }
                        </Markers>
                    </ZoomableGlobe>
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

export { Globe }
